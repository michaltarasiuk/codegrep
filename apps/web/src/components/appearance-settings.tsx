import { SlidersIcon } from "@primer/octicons-react";
import { Dialog, IconButton, Stack, Text, ToggleSwitch } from "@primer/react";
import { useId, useRef, useState } from "react";

export function AppearanceSettings() {
  const [isOpen, setIsOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  return (
    <>
      <IconButton
        aria-label="Appearance settings"
        icon={SlidersIcon}
        onClick={() => setIsOpen(true)}
        ref={triggerRef}
      />
      {isOpen && (
        <Dialog
          onClose={() => setIsOpen(false)}
          returnFocusRef={triggerRef}
          title="Appearance settings."
          width="large"
        >
          <Stack direction="vertical" gap="condensed">
            <LabeledToggle label="Light mode" />
            <LabeledToggle label="Dark mode" />
          </Stack>
        </Dialog>
      )}
    </>
  );
}

function LabeledToggle({ label }: { label: string }) {
  const id = useId();
  return (
    <Stack
      align="center"
      direction="horizontal"
      gap="normal"
      justify="space-between"
    >
      <Text id={id} weight="medium">
        {label}
      </Text>
      <ToggleSwitch aria-labelledby={id} />
    </Stack>
  );
}
