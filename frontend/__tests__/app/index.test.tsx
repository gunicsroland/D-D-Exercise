import { render } from "@testing-library/react-native";
import Home from "../../src/app";
import { useAuthContext } from "../../src/context/AuthContext";
import { checkCharacter } from "../../src/services/character_service";
import { useRouter } from "expo-router";
import React from "react";

jest.mock("../context/AuthContext", () => ({
  useAuthContext: jest.fn(),
}));

jest.mock("../services/character_service", () => ({
  checkCharacter: jest.fn(),
}));

jest.mock("expo-router", () => ({
  useRouter: jest.fn(),
}));

it("redirects to login when no token", () => {
  const replaceMock = jest.fn();

  (useAuthContext as jest.Mock).mockReturnValue({
    token: null,
    loading: false,
  });

  (useRouter as jest.Mock).mockReturnValue({
    replace: replaceMock,
  });

  render(<Home />);

  expect(replaceMock).toHaveBeenCalledWith("/login");
});

it("redirects to character create when no character", async () => {
  const replaceMock = jest.fn();

  (useAuthContext as jest.Mock).mockReturnValue({
    token: "token",
    loading: false,
  });

  (useRouter as jest.Mock).mockReturnValue({
    replace: replaceMock,
  });

  (checkCharacter as jest.Mock).mockResolvedValue(false);

  render(<Home />);

  await new Promise((r) => setTimeout(r, 0));

  expect(replaceMock).toHaveBeenCalledWith("/character/create");
});

it("redirects to tabs when character exists", async () => {
  const replaceMock = jest.fn();

  (useAuthContext as jest.Mock).mockReturnValue({
    token: "token",
    loading: false,
  });

  (useRouter as jest.Mock).mockReturnValue({
    replace: replaceMock,
  });

  (checkCharacter as jest.Mock).mockResolvedValue(true);

  render(<Home />);

  await new Promise((r) => setTimeout(r, 0));

  expect(replaceMock).toHaveBeenCalledWith("/tabs/character");
});

it("does not redirect while loading", () => {
  const replaceMock = jest.fn();

  (useAuthContext as jest.Mock).mockReturnValue({
    token: null,
    loading: true,
  });

  (useRouter as jest.Mock).mockReturnValue({
    replace: replaceMock,
  });

  render(<Home />);

  expect(replaceMock).not.toHaveBeenCalled();
});

it("redirects to login on error", async () => {
  const replaceMock = jest.fn();

  (useAuthContext as jest.Mock).mockReturnValue({
    token: "token",
    loading: false,
  });

  (useRouter as jest.Mock).mockReturnValue({
    replace: replaceMock,
  });

  (checkCharacter as jest.Mock).mockRejectedValue(new Error("fail"));

  render(<Home />);

  await new Promise((r) => setTimeout(r, 0));

  expect(replaceMock).toHaveBeenCalledWith("/login");
});