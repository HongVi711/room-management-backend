import { ExpenseCategory } from "../models/Expense.model";

export interface CreateExpenseInput {
  buildingId: string;
  title: string;
  description?: string;
  amount: number;
  category: ExpenseCategory;
  expenseDate: Date;
}

export interface GetExpensesParams {
  buildingId?: string;
  category?: string;
  startDate?: string;
  endDate?: string;
  page?: number;
  limit?: number;
}
