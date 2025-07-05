// src/components/Footer.jsx
import {
  Box,
  Text,
  Stack,
  useColorModeValue,
  Image,
  Spinner,
  Highlight,
} from "@chakra-ui/react";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

const Footer = () => {
  const [tcImage, setTcImage] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGallery = async () => {
      try {
        const res = await axios.get("/api/gallery");
        const tcImpactImg = res.data.find(
          (img) => img.caption === "TC Impact Logo"
        );
        setTcImage(tcImpactImg);
      } catch (err) {
        console.error("Failed to load TC Impact Logo", err);
      } finally {
        setLoading(false);
      }
    };

    fetchGallery();
  }, []);

  return (
    <Box
      as="footer"
      py={4}
      bg={useColorModeValue("gray.300", "gray.700")}
      color={useColorModeValue("gray.700", "gray.200")}
      mt={4}
      textAlign="center"
    >
      <Stack spacing={2} align="center">
        <Text fontSize="sm">
          © {new Date().getFullYear()}{" "}
          <Link to="/about">
            {loading ? (
              <Spinner size="xs" ml={2} />
            ) : tcImage ? (
              <>
                <Image
                  src={tcImage.imageUrl}
                  alt={tcImage.caption}
                  boxSize="20px"
                  display="inline-block"
                  verticalAlign="middle"
                  ml={1}
                  mb="4px"
                />
              </>
            ) : (
              <Text as="span" fontSize="xs" color="red.400">
                TC Impact Logo not found
              </Text>
            )}
          </Link>{" "}
          . All rights reserved.
        </Text>

        <Text fontSize="xs">Baitun Noor Jame Mosjid, Estd: 1986</Text>
      </Stack>
    </Box>
  );
};

export default Footer;
