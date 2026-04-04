import React from "react";
import { render, fireEvent, waitFor, act } from "@testing-library/react-native";
import AdventureChatScreen from "./[sessionId]";

jest.mock("expo-router", () => ({
  useLocalSearchParams: () => ({ sessionId: "1" }),
  router: { back: jest.fn() },
}));

jest.mock("../../context/AuthContext", () => ({
  useAuthContext: () => ({ token: "token-123" }),
}));

global.fetch = jest.fn();beforeEach(() => {
  jest.clearAllMocks();
});

it("fetches messages on mount", async () => {
  (fetch as jest.Mock).mockResolvedValueOnce({
    ok: true,
    json: async () => [
      { id: 1, role: "user", content: "Hello" },
    ],
  });

  const { getByTestId } = render(<AdventureChatScreen />);

  await waitFor(() => {
    expect(getByTestId("messages-list")).toBeTruthy();
  });

  expect(fetch).toHaveBeenCalled();
});

it("shows error when fetch fails", async () => {
  (fetch as jest.Mock).mockRejectedValueOnce(new Error());

  const { getByTestId } = render(<AdventureChatScreen />);

  await waitFor(() => {
    expect(getByTestId("error-text")).toBeTruthy();
  });
});

it("sends message and updates UI", async () => {
  (fetch as jest.Mock)
    .mockResolvedValueOnce({
      ok: true,
      json: async () => [],
    })
    .mockResolvedValueOnce({
      ok: true,
      json: async () => ({ message: "AI reply" }),
    });

  const { getByTestId, getByDisplayValue } = render(
    <AdventureChatScreen />
  );

  const input = getByTestId("message-input");
  const button = getByTestId("send-button");

  fireEvent.changeText(input, "Hello");
  fireEvent.press(button);

  await waitFor(() => {
    expect(fetch).toHaveBeenCalled();
  });

  expect(getByDisplayValue("")).toBeTruthy();
});

it("does not send empty message", async () => {
  const { getByTestId } = render(<AdventureChatScreen />);

  await act(async () => {
    fireEvent.press(getByTestId("send-button"));
  })

const postCalls = (fetch as jest.Mock).mock.calls.filter(
    (call) => call[1]?.method === "POST"
  );

  expect(postCalls.length).toBe(0);
});

it("disables send button while talking", async () => {
  (fetch as jest.Mock).mockImplementation(
    () =>
      new Promise((resolve) =>
        setTimeout(() => resolve({ ok: true, json: async () => ({}) }), 100)
      )
  );

  const { getByTestId } = render(<AdventureChatScreen />);

  const input = getByTestId("message-input");
  const button = getByTestId("send-button");

  fireEvent.changeText(input, "Hello");
  fireEvent.press(button);

  expect(button.props.accessibilityState?.disabled ?? button.props.disabled).toBe(true);
});