// src/components/Footer.jsx
import {
  Box,
  Text,
  Stack,
  useColorModeValue,
  Highlight,
} from "@chakra-ui/react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <Box
      as="footer"
      py={4}
      bg={useColorModeValue("gray.300", "gray.700")}
      color={useColorModeValue("gray.700", "gray.200")}
      mt={0}
      textAlign="center"
    >
      <Stack spacing={2}>
        <Text fontSize="sm">
          © {new Date().getFullYear()}{" "}
          <Link to={"about"}>
            <Text as="u">
              <Highlight
                query="KnitNox"
                as="u"
                styles={{ px: "2", py: "1", bg: "green.200" }}
              >
                KnitNox
              </Highlight>
            </Text>
          </Link>
          . All rights reserved.
        </Text>
        <Text fontSize="xs">
          Built with ❤️ using React, Vite, Node, Express, MongoDB
        </Text>
      </Stack>
    </Box>
  );
};

export default Footer;
