import { jest } from "@jest/globals";

function calculateDiscount(price, discount) {
  return price - (price * discount) / 100;
}

test("should calculate a 10% discount", () => {
  expect(calculateDiscount(1000, 10)).toBe(900);
});

test("should return original price for 0% discount", () => {
  expect(calculateDiscount(1000, 0)).toBe(1000);
});

test("should return zero for 100% discount", () => {
  expect(calculateDiscount(1000, 100)).toBe(0);
});

test("CI should detect a failing test", () => {
  expect(2 + 2).toBe(4);
});


test("mock function should return configured value", () => {
  const paymentMock = jest.fn().mockResolvedValue({
    success: true,
    transactionId: "TXN123"
  });

  return paymentMock(500).then((result) => {
    expect(result.success).toBe(true);
    expect(result.transactionId).toBe("TXN123");

    // Check whether the mock was called
    expect(paymentMock).toHaveBeenCalled();

    // Check the arguments passed to it
    expect(paymentMock).toHaveBeenCalledWith(500);
  });
});

