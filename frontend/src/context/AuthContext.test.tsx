import React from "react";
import { render, act, waitFor } from "@testing-library/react-native";
import { AuthProvider, useAuthContext } from "./AuthContext";
import { storage } from "../services/storage_service";
import { loginRequest, registerRequest, getMe } from "../services/auth_service";

const mockReplace = jest.fn();

jest.mock("expo-router", () => ({
    useRouter: () => ({
        replace: mockReplace,
    }),
}));

jest.mock("../services/storage_service", () => ({
    storage: {
        getToken: jest.fn(),
        setToken: jest.fn(),
        removeToken: jest.fn(),
    },
}));

jest.mock("../services/auth_service", () => ({
    loginRequest: jest.fn(),
    registerRequest: jest.fn(),
    getMe: jest.fn(),
}));

const TestComponent = () => {
    const { user, token, loading, login, register, logout } =
        useAuthContext();

    return null;
};

beforeEach(() => {
    jest.clearAllMocks();
});

it("throws error when used outside provider", () => {
    const consoleError = jest.spyOn(console, "error").mockImplementation(() => { });

    expect(() => {
        render(<TestComponent />);
    }).toThrow();

    consoleError.mockRestore();
});

it("restores session when token exists", async () => {
    (storage.getToken as jest.Mock).mockResolvedValue("token123");
    (getMe as jest.Mock).mockResolvedValue({ id: "1", username: "user" });

    let contextValue: any;

    const TestWrapper = () => {
        contextValue = useAuthContext();
        return null;
    };

    render(
        <AuthProvider>
            <TestWrapper />
        </AuthProvider>
    );

    await waitFor(() => {
        expect(contextValue.loading).toBe(false);
        expect(contextValue.token).toBe("token123");
        expect(contextValue.user).toEqual({ id: "1", username: "user" });
    });
});

it("clears token if restore fails", async () => {
    (storage.getToken as jest.Mock).mockResolvedValue("token123");
    (getMe as jest.Mock).mockRejectedValue(new Error("fail"));

    const removeTokenSpy = storage.removeToken as jest.Mock;

    let contextValue: any;

    const TestWrapper = () => {
        contextValue = useAuthContext();
        return null;
    };

    render(
        <AuthProvider>
            <TestWrapper />
        </AuthProvider>
    );

    await waitFor(() => {
        expect(removeTokenSpy).toHaveBeenCalled();
        expect(contextValue.token).toBe(null);
        expect(contextValue.user).toBe(null);
    });
});

it("login flow works correctly", async () => {
    (loginRequest as jest.Mock).mockResolvedValue({
        access_token: "token123",
    });

    (getMe as jest.Mock).mockResolvedValue({
        id: "1",
        username: "user",
    });

    let contextValue: any;

    const TestWrapper = () => {
        contextValue = useAuthContext();
        return null;
    };

    render(
        <AuthProvider>
            <TestWrapper />
        </AuthProvider>
    );

    await act(async () => {
        await contextValue.login("user", "pass");
    });

    expect(loginRequest).toHaveBeenCalledWith("user", "pass");
    expect(storage.setToken).toHaveBeenCalledWith("token123");
    expect(contextValue.token).toBe("token123");
    expect(contextValue.user).toEqual({ id: "1", username: "user" });
});

it("register flow calls register then login", async () => {
    (registerRequest as jest.Mock).mockResolvedValue({});
    (loginRequest as jest.Mock).mockResolvedValue({
        access_token: "token123",
    });
    (getMe as jest.Mock).mockResolvedValue({
        id: "1",
        username: "user",
    });

    let contextValue: any;

    const TestWrapper = () => {
        contextValue = useAuthContext();
        return null;
    };

    render(
        <AuthProvider>
            <TestWrapper />
        </AuthProvider>
    );

    await act(async () => {
        await contextValue.register("user", "email@test.com", "pass");
    });

    expect(registerRequest).toHaveBeenCalledWith(
        "user",
        "email@test.com",
        "pass"
    );

    expect(loginRequest).toHaveBeenCalledWith("user", "pass");
});

it("logout clears state and navigates", async () => {
    let contextValue: any;

    const TestWrapper = () => {
        contextValue = useAuthContext();
        return null;
    };

    render(
        <AuthProvider>
            <TestWrapper />
        </AuthProvider>
    );

    await act(async () => {
        await contextValue.logout();
    });

    expect(storage.removeToken).toHaveBeenCalled();
    expect(mockReplace).toHaveBeenCalledWith("/login");
});