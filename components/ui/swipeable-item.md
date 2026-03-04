# SwipeableItem Component

A highly customizable, accessible swipeable component for React with gesture support, haptic feedback, and smooth animations.

## Features

- ✅ **Gesture Support**: Smooth swipe gestures using @use-gesture/react
- ✅ **Spring Animations**: Configurable spring physics via Framer Motion
- ✅ **Snap Behavior**: Automatically snaps open/closed based on threshold
- ✅ **Trigger Actions**: Pull beyond threshold to trigger action (single button only)
- ✅ **Haptic Feedback**: Vibration on mobile when reaching trigger threshold
- ✅ **Accessibility**: ARIA labels, keyboard support (Escape to close)
- ✅ **Click Outside**: Auto-closes when clicking outside the component
- ✅ **Flexible Styling**: Customizable button variants and classes
- ✅ **Disabled State**: Can disable swiping when needed
- ✅ **Callbacks**: onSwipeStart and onSwipeEnd hooks

## Basic Usage

```tsx
import { SwipeableItem } from "@/components/ui/swipeable-item";
import { Trash2, Archive } from "lucide-react";

<SwipeableItem
  leftButtons={[
    {
      icon: <Trash2 className="size-4" />,
      onClick: () => handleDelete(),
      ariaLabel: "Delete item",
    },
  ]}
>
  <div>Your content here</div>
</SwipeableItem>
```

## Props

### `children` (required)
- Type: `ReactNode`
- The main content to display

### `leftButtons`
- Type: `SwipeButton[]`
- Buttons revealed when swiping right
- Each button can have: `icon`, `onClick`, `variant`, `className`, `ariaLabel`

### `rightButtons`
- Type: `SwipeButton[]`
- Buttons revealed when swiping left

### `snapThreshold`
- Type: `number`
- Default: `0.4`
- Percentage of button width needed to snap open (0-1)

### `triggerThreshold`
- Type: `number`
- Default: `1.5`
- Multiplier for trigger action (single button only)
- Set to `1.5` means pull 1.5x the button width to trigger

### `baseButtonSize`
- Type: `number`
- Default: `32`
- Base button size in pixels

### `disabled`
- Type: `boolean`
- Default: `false`
- Disables swipe gestures when true

### `onSwipeStart`
- Type: `() => void`
- Callback fired when swipe gesture starts

### `onSwipeEnd`
- Type: `() => void`
- Callback fired when swipe gesture ends

### `springConfig`
- Type: `{ stiffness?: number; damping?: number }`
- Default: `{ stiffness: 400, damping: 40 }`
- Customize spring animation physics

## Advanced Examples

### Multiple Buttons

```tsx
<SwipeableItem
  leftButtons={[
    {
      icon: <Archive className="size-4" />,
      onClick: handleArchive,
      variant: "secondary",
      ariaLabel: "Archive",
    },
    {
      icon: <Trash2 className="size-4" />,
      onClick: handleDelete,
      variant: "destructive",
      ariaLabel: "Delete",
    },
  ]}
  rightButtons={[
    {
      icon: <Star className="size-4" />,
      onClick: handleFavorite,
      variant: "default",
      ariaLabel: "Favorite",
    },
  ]}
>
  <div>Content</div>
</SwipeableItem>
```

### Custom Animation

```tsx
<SwipeableItem
  snapThreshold={0.3}
  triggerThreshold={2.0}
  springConfig={{ stiffness: 300, damping: 30 }}
  onSwipeStart={() => console.log("Swipe started")}
  onSwipeEnd={() => console.log("Swipe ended")}
>
  <div>Content</div>
</SwipeableItem>
```

### Conditional Disable

```tsx
<SwipeableItem
  disabled={isLoading}
  leftButtons={[...]}
>
  <div>Content</div>
</SwipeableItem>
```

## Behavior Details

### Snap Behavior
- Swipe past `snapThreshold` (default 40%) to snap open
- Otherwise snaps back to closed position
- Uses smooth spring animation

### Trigger Action (Single Button Only)
- Only works when there's exactly 1 button on a side
- Pull beyond `triggerThreshold` (default 1.5x) to trigger
- Button expands and fades during pull
- Haptic feedback on mobile when near threshold
- Auto-closes after triggering

### Keyboard Support
- Press `Escape` to close any open swipe panel

### Click Outside
- Clicking/tapping outside closes the swipe panel
- Works with both mouse and touch events

## Accessibility

- ARIA labels on button groups and individual buttons
- Keyboard support for closing (Escape key)
- Proper role attributes
- Touch action optimization for scroll performance

## Performance Notes

- Width calculations are cached during drag
- Animation configs are memoized
- Event listeners properly cleaned up
- Minimal re-renders with useCallback and useMemo

## Browser Support

- Modern browsers with touch support
- Haptic feedback requires Vibration API (mobile browsers)
- Gracefully degrades when APIs unavailable
