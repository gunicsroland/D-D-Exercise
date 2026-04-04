import { renderHook } from "@testing-library/react-native";
import { useActiveTimer } from "../src/hooks/useActiveTimer";

it("clears interval on unmount", () => {
  const clearSpy = jest.spyOn(global, "clearInterval");

  const { unmount } = renderHook(() => useActiveTimer(1000));

  unmount();

  expect(clearSpy).toHaveBeenCalled();
});
