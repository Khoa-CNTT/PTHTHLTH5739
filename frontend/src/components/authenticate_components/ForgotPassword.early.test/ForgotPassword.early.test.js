// Unit tests for: ForgotPassword

import React from "react";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import axios from "axios";
import { BrowserRouter as Router } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import ForgotPassword from "../ForgotPassword";
import "@testing-library/jest-dom";

// Mock axios
jest.mock("axios");

describe("ForgotPassword() ForgotPassword method", () => {
  beforeEach(() => {
    // Clear all instances and calls to constructor and all methods:
    axios.post.mockClear();
  });

  // Happy Path Tests
  describe("Happy Path", () => {
    test("renders ForgotPassword component correctly", () => {
      render(
        <Router>
          <ForgotPassword />
        </Router>
      );
      expect(screen.getByText("Forgot Password")).toBeInTheDocument();
      expect(
        screen.getByPlaceholderText("Enter your email")
      ).toBeInTheDocument();
      expect(screen.getByRole("button", { name: /send/i })).toBeInTheDocument();
    });

    test("submits valid email and shows success message", async () => {
      axios.post.mockResolvedValueOnce({ data: { Status: "Success" } });

      render(
        <Router>
          <ForgotPassword />
        </Router>
      );

      const emailInput = screen.getByPlaceholderText("Enter your email");
      const submitButton = screen.getByRole("button", { name: /send/i });

      fireEvent.change(emailInput, { target: { value: "test@example.com" } });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(axios.post).toHaveBeenCalledWith(
          "http://localhost:4000/api/authenticate/forgotpassword",
          { email: "test@example.com" }
        );
        expect(
          screen.getByText("Check your email for further instructions.")
        ).toBeInTheDocument();
      });
    });
  });

  // Edge Case Tests
  describe("Edge Cases", () => {
    test("shows error message for invalid email format", () => {
      render(
        <Router>
          <ForgotPassword />
        </Router>
      );

      const emailInput = screen.getByPlaceholderText("Enter your email");
      fireEvent.change(emailInput, { target: { value: "invalid-email" } });

      expect(
        screen.getByText("Please enter a valid email address.")
      ).toBeInTheDocument();
    });

    test("shows error message for non-existent email", async () => {
      axios.post.mockResolvedValueOnce({ data: { Status: "Not Existed" } });

      render(
        <Router>
          <ForgotPassword />
        </Router>
      );

      const emailInput = screen.getByPlaceholderText("Enter your email");
      const submitButton = screen.getByRole("button", { name: /send/i });

      fireEvent.change(emailInput, {
        target: { value: "nonexistent@example.com" },
      });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(
          screen.getByText("Not Existed Email In System.")
        ).toBeInTheDocument();
      });
    });

    test("handles server error gracefully", async () => {
      axios.post.mockRejectedValueOnce(new Error("Server Error"));

      render(
        <Router>
          <ForgotPassword />
        </Router>
      );

      const emailInput = screen.getByPlaceholderText("Enter your email");
      const submitButton = screen.getByRole("button", { name: /send/i });

      fireEvent.change(emailInput, { target: { value: "test@example.com" } });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(
          screen.getByText("An error occurred. Please try again.")
        ).toBeInTheDocument();
      });
    });
  });
});

// End of unit tests for: ForgotPassword
