import {
  BankAccount,
  WithdrawalRequest,
  WithdrawalResult,
  WithdrawalError,
} from "./types";

export function createAccount(account: BankAccount): BankAccount | WithdrawalError {
  if (account.balance < 0) {
    return {
      code: "INVALID_AMOUNT",
      message: "Account balance cannot be negative"
    };
  }
  
  if (account.balance === 0) {
    return {
      code: "INVALID_AMOUNT",
      message: "Initial account balance must be positive"
    };
  }

  return account;
}

export function processWithdrawal(
  account: BankAccount,
  withdrawal: WithdrawalRequest
): WithdrawalResult | WithdrawalError {
  // Validate account ID
  if (account.id !== withdrawal.accountId) {
    return {
      code: "ACCOUNT_NOT_FOUND",
      message: "Account not found"
    };
  }

  // Validate currency
  if (account.currency !== withdrawal.currency) {
    return {
      code: "INVALID_AMOUNT",
      message: "Currency mismatch"
    };
  }

  // Validate amount
  if (withdrawal.amount <= 0) {
    return {
      code: "INVALID_AMOUNT",
      message: "Amount must be positive"
    };
  }

  // Check sufficient funds
  if (withdrawal.amount > account.balance) {
    return {
      code: "INSUFFICIENT_FUNDS",
      message: "Insufficient funds"
    };
  }

  // Process successful withdrawal
  const newBalance = account.balance - withdrawal.amount;
  const transaction = {
    id: `txn_${Date.now()}`,
    amount: withdrawal.amount,
    currency: withdrawal.currency,
    timestamp: new Date(),
    remainingBalance: newBalance
  };

  return {
    success: true,
    transaction
  };
}
