import dotenv from "dotenv";
dotenv.config();

import { v2 as cloudinary } from "cloudinary";
import mongoose from "mongoose";
import Room from "../models/room.model";
import User from "../models/user.model";

// Script chạy một lần để xóa ảnh CCCD cũ. Thao tác xóa không khôi phục được.
// Chạy thử: npx ts-node src/scripts/cleanup-cccd-images.ts
// Chạy thật: npx ts-node src/scripts/cleanup-cccd-images.ts --confirm=<CLOUDINARY_CLOUD_NAME>
// Trong container production không có ts-node, thay bằng: node dist/scripts/cleanup-cccd-images.js

const IMAGE_PREFIX = "users_cccd/";
const HAS_MEMBER_IMAGES = { "members.cccdImages": { $exists: true } };
const HAS_USER_IMAGES = { cccdImages: { $exists: true } };

const countImages = async (): Promise<number> => {
  let total = 0;
  let nextCursor: string | undefined;

  do {
    const result = await cloudinary.api.resources({
      type: "upload",
      prefix: IMAGE_PREFIX,
      max_results: 500,
      ...(nextCursor && { next_cursor: nextCursor }),
    });
    total += result.resources.length;
    nextCursor = result.next_cursor;
  } while (nextCursor);

  return total;
};

const deleteImages = async (): Promise<void> => {
  let nextCursor: string | undefined;

  do {
    const result = await cloudinary.api.delete_resources_by_prefix(
      IMAGE_PREFIX,
      {
        invalidate: true,
        ...(nextCursor && { next_cursor: nextCursor }),
      },
    );
    nextCursor = result.next_cursor;
  } while (nextCursor);
};

const countMembers = async (): Promise<number> => {
  const result = await Room.collection
    .aggregate([
      { $match: HAS_MEMBER_IMAGES },
      { $unwind: "$members" },
      { $match: HAS_MEMBER_IMAGES },
      { $count: "total" },
    ])
    .toArray();

  return result[0]?.total ?? 0;
};

const printCounts = async (label: string): Promise<number> => {
  const images = await countImages();
  const users = await User.collection.countDocuments(HAS_USER_IMAGES);
  const members = await countMembers();

  console.log(`${label}:`);
  console.log(`- Ảnh trong "${IMAGE_PREFIX}" trên Cloudinary: ${images}`);
  console.log(`- User có trường cccdImages: ${users}`);
  console.log(`- Thành viên phòng có trường cccdImages: ${members}`);

  return images + users + members;
};

const run = async () => {
  const {
    CLOUDINARY_CLOUD_NAME: cloudName,
    CLOUDINARY_API_KEY: apiKey,
    CLOUDINARY_API_SECRET: apiSecret,
    MONGO_URI: mongoUri,
  } = process.env;

  if (!cloudName || !apiKey || !apiSecret || !mongoUri) {
    throw new Error("Thiếu biến môi trường Cloudinary hoặc MONGO_URI");
  }

  const confirmArg = process.argv.find((arg) => arg.startsWith("--confirm"));
  if (confirmArg && confirmArg !== `--confirm=${cloudName}`) {
    throw new Error("Giá trị --confirm không khớp với CLOUDINARY_CLOUD_NAME");
  }

  cloudinary.config({
    cloud_name: cloudName,
    api_key: apiKey,
    api_secret: apiSecret,
  });
  await mongoose.connect(mongoUri);

  console.log(`Cloudinary: ${cloudName}`);
  console.log(
    `MongoDB: ${mongoose.connection.host}/${mongoose.connection.name}`,
  );
  await printCounts("Trước khi xóa");

  if (!confirmArg) {
    console.log(`Chạy thử, chưa xóa gì. Chạy thật: --confirm=${cloudName}`);
    return;
  }

  // Xóa ảnh trước. Nếu lỗi giữa chừng, database chưa đổi và có thể chạy lại.
  await deleteImages();
  await User.collection.updateMany(HAS_USER_IMAGES, {
    $unset: { cccdImages: "" },
  });
  await Room.collection.updateMany(HAS_MEMBER_IMAGES, {
    $unset: { "members.$[].cccdImages": "" },
  });

  const remaining = await printCounts("Sau khi xóa");
  if (remaining > 0) {
    throw new Error("Vẫn còn dữ liệu ảnh CCCD, hãy chạy lại");
  }
};

run()
  .catch((error) => {
    console.error("Lỗi:", error?.error?.message ?? error?.message ?? error);
    process.exitCode = 1;
  })
  .finally(() => mongoose.disconnect());
