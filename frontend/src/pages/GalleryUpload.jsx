import { useState } from "react";
import {
  Box,
  Button,
  Input,
  Select,
  Text,
  VStack,
  useToast,
  useColorModeValue,
} from "@chakra-ui/react";
import axios from "axios";

const GalleryUpload = () => {
  const [image, setImage] = useState(null);
  const [caption, setCaption] = useState("");
  const [category, setCategory] = useState("process");
  const toast = useToast();

  // Dark mode compatible colors
  const bgColor = useColorModeValue("gray.100", "gray.700");
  const borderColor = useColorModeValue("gray.200", "gray.600");
  const inputBg = useColorModeValue("white", "gray.800");

  const handleImageUpload = async () => {
    if (!image || !caption || !category) {
      toast({
        title: "All fields are required.",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    const formData = new FormData();
    formData.append("file", image);
    formData.append("upload_preset", "tcmosque");
    formData.append("cloud_name", "dncqgprbj");

    try {
      const res = await axios.post(
        `https://api.cloudinary.com/v1_1/dncqgprbj/image/upload`,
        formData
      );

      await axios.post("/api/gallery", {
        imageUrl: res.data.secure_url,
        caption,
        category,
      });

      toast({
        title: "Image uploaded successfully!",
        status: "success",
        duration: 3000,
        isClosable: true,
      });

      setImage(null);
      setCaption("");
      setCategory("process");
    } catch (error) {
      toast({
        title: "Upload failed.",
        description: error.message,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  return (
    <Box
      maxW="md"
      mx="auto"
      mt={10}
      p={6}
      bg={bgColor}
      borderWidth="1px"
      borderColor={borderColor}
      borderRadius="lg"
      boxShadow="md"
    >
      <VStack spacing={5}>
        <Text fontSize="xl" fontWeight="bold" mb={2}>
          Upload to Gallery
        </Text>

        <Input
          type="file"
          accept="image/*"
          onChange={(e) => setImage(e.target.files[0])}
          borderColor={borderColor}
          bg={inputBg}
          p={2}
        />

        <Input
          placeholder="Caption"
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
          borderColor={borderColor}
          bg={inputBg}
        />

        <Select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          borderColor={borderColor}
          bg={inputBg}
        >
          <option value="process">Construction Process</option>
          <option value="3d-model">3D Model</option>
        </Select>

        <Button colorScheme="orange" onClick={handleImageUpload}>
          Upload Photo
        </Button>
      </VStack>
    </Box>
  );
};

export default GalleryUpload;
