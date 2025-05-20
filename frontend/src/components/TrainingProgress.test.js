import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import axios from "axios";
import TrainingProgress from "./TrainingProgress";

jest.mock("axios");

describe("TrainingProgress component", () => {
  beforeEach(() => {
    // Always mock axios.get to return a pending promise by default
    axios.get.mockImplementation(() => new Promise(() => {}));
  });

  it("renders training progress from backend", async () => {
    axios.get.mockResolvedValueOnce({ data: { current_epoch: 2, total_epochs: 5, loss: 0.42 } });
    render(<TrainingProgress />);
    expect(await screen.findByText(/Training Progress/i)).toBeInTheDocument();
    expect(await screen.findByText(/Current Epoch: 2/i)).toBeInTheDocument();
    expect(await screen.findByText(/Total Epochs: 5/i)).toBeInTheDocument();
    expect(await screen.findByText(/Loss: 0.42/i)).toBeInTheDocument();
  });

  it("shows error if training progress cannot be fetched", async () => {
    axios.get.mockRejectedValueOnce(new Error("Network error"));
    render(<TrainingProgress />);
    expect(await screen.findByText(/Could not fetch training progress/i)).toBeInTheDocument();
  });

  it("shows loading initially", () => {
    render(<TrainingProgress />);
    expect(screen.getByText(/Loading training progress/i)).toBeInTheDocument();
  });
});
