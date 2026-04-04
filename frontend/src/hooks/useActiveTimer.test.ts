import { renderHook, act } from "@testing-library/react-native";
import { useActiveTimer } from "./useActiveTimer";

it("clears interval on unmount", () => {
    const clearSpy = jest.spyOn(global, "clearInterval");

    const { unmount } = renderHook(() => useActiveTimer(1000));

    unmount();

    expect(clearSpy).toHaveBeenCalled();
});