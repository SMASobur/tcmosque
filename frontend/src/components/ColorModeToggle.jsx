import { motion, AnimatePresence } from "framer-motion";
import { MoonIcon, SunIcon } from "@chakra-ui/icons";
import { Box, Button, useColorMode } from "@chakra-ui/react";

const MotionBox = motion(Box);

export const ColorModeToggle = () => {
  const { colorMode, toggleColorMode } = useColorMode();

  return (
    <Button
      onClick={toggleColorMode}
      aria-label="Toggle color mode"
      variant="ghost"
      p={0}
      position="relative"
      w="60px"
      h="32px"
      borderRadius="full"
      bg={colorMode === "light" ? "gray.200" : "gray.500"}
      _hover={{ bg: colorMode === "light" ? "gray.400" : "gray.800" }}
    >
      <MotionBox
        position="absolute"
        left={colorMode === "light" ? "4px" : "32px"}
        top="4px"
        w="24px"
        h="24px"
        borderRadius="full"
        bg={colorMode === "light" ? "yellow.300" : "gray.300"}
        layout
        transition={{
          type: "spring",
          stiffness: 500,
          damping: 30,
        }}
      >
        <AnimatePresence mode="wait">
          <MotionBox
            key={colorMode}
            initial={{ opacity: 0, rotate: colorMode === "light" ? 90 : -90 }}
            animate={{ opacity: 1, rotate: 0 }}
            exit={{ opacity: 0, rotate: colorMode === "light" ? -90 : 90 }}
            transition={{ duration: 0.2 }}
            display="flex"
            alignItems="center"
            justifyContent="center"
            w="100%"
            h="100%"
          >
            {colorMode === "light" ? (
              <SunIcon color="orange.500" boxSize={4} />
            ) : (
              <MoonIcon color="blue.700" boxSize={3} />
            )}
          </MotionBox>
        </AnimatePresence>
      </MotionBox>
    </Button>
  );
};
