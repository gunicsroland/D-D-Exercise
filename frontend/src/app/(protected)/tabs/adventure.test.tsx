import { useAuthContext } from "../../../context/AuthContext";
import { useRouter } from "expo-router";
import { render, fireEvent, waitFor } from "@testing-library/react-native";
import KalandScreen from "./adventure";
import React from "react";

jest.mock("../../../context/AuthContext", () => ({
  useAuthContext: jest.fn(),
}));

jest.mock("expo-router", () => ({
  useRouter: jest.fn(),
}));

global.fetch = jest.fn();
global.alert = jest.fn();

global.prompt = jest.fn();

const mockSessions = [
  { id: 1, character_id: 1, user_id: 1, title: "Session 1" },
  { id: 2, character_id: 1, user_id: 1, title: "Session 2" },
];

const mockPush = jest.fn();

beforeEach(() => {
  jest.clearAllMocks();

  (useAuthContext as jest.Mock).mockReturnValue({
    token: "token123",
  });

  (useRouter as jest.Mock).mockReturnValue({
    push: mockPush,
  });

  (fetch as jest.Mock).mockResolvedValue({
    json: async () => mockSessions,
  });
});

it("fetches and displays sessions", async () => {
  const { findByTestId } = render(<KalandScreen />);

  await findByTestId("session-1");

  expect(true).toBe(true);
});

it("starts a new adventure", async () => {
  (fetch as jest.Mock)
    .mockResolvedValueOnce({
      json: async () => mockSessions,
    })
    .mockResolvedValueOnce({
      json: async () => ({}),
    })
    .mockResolvedValueOnce({
      json: async () => mockSessions,
    });

  const { getByTestId } = render(<KalandScreen />);

  fireEvent.changeText(getByTestId("title-input"), "New Adventure");

  fireEvent.press(getByTestId("start-adventure-button"));

  await waitFor(() => {
    expect(fetch).toHaveBeenCalledWith(
      expect.stringContaining("/adventure/start"),
      expect.objectContaining({
        method: "POST",
      })
    );
  });
});

it("navigates when selecting a session", async () => {
  const { findByTestId } = render(<KalandScreen />);

  const button = await findByTestId("select-session-1");

  fireEvent.press(button);

  expect(mockPush).toHaveBeenCalledWith({
    pathname: "/[sessionId]",
    params: {
      sessionId: 1,
      title: "Session 1",
    },
  });
});

it("deletes a session", async () => {
  const { findByTestId } = render(<KalandScreen />);

  const button = await findByTestId("delete-session-1");

  fireEvent.press(button);

  await waitFor(() => {
    expect(fetch).toHaveBeenCalledWith(
      expect.stringContaining("/adventure/1"),
      expect.objectContaining({
        method: "DELETE",
      })
    );
  });
});

it("renames a session", async () => {
  const { findByTestId, getByTestId } = render(<KalandScreen />);

  const renameButton = await findByTestId("rename-session-1");

  fireEvent.press(renameButton);

  expect(getByTestId("rename-modal")).toBeTruthy();

  fireEvent.changeText(getByTestId("rename-input"), "New Title");

  fireEvent.press(getByTestId("rename-save-button"));

  await waitFor(() => {
    expect(fetch).toHaveBeenCalledWith(
      expect.stringContaining("/title"),
      expect.objectContaining({
        method: "PUT",
      })
    );
  });
});

it("does not rename if prompt returns null", async () => {
  (global.prompt as jest.Mock).mockReturnValue(null);

  const { findByTestId } = render(<KalandScreen />);

  const button = await findByTestId("rename-session-1");

  fireEvent.press(button);

  await waitFor(() => {
    expect(fetch).not.toHaveBeenCalledWith(
      expect.stringContaining("/title"),
      expect.anything()
    );
  });
});