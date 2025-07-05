import { useState, useEffect } from "react";
import { Text, Box, useColorModeValue, Flex } from "@chakra-ui/react";

const BangladeshClock = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [hijriDate, setHijriDate] = useState("");

  useEffect(() => {
    const updateDateTime = () => {
      const now = new Date();
      setCurrentTime(now);

      // Format Hijri date
      const hijri = new Intl.DateTimeFormat("en-u-ca-islamic", {
        day: "numeric",
        month: "long",
        year: "numeric",
      }).format(now);

      setHijriDate(hijri.replace("AH", "Hijri"));
    };

    updateDateTime();
    const timer = setInterval(updateDateTime, 1000);

    return () => clearInterval(timer);
  }, []);

  const timeString = currentTime.toLocaleTimeString("en-BD", {
    timeZone: "Asia/Dhaka",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });

  const dateString = currentTime.toLocaleDateString("en-BD", {
    timeZone: "Asia/Dhaka",
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <Box
      textAlign="center"
      p={4}
      borderRadius="lg"
      bg={useColorModeValue("orange.50", "gray.700")}
      borderWidth="1px"
      borderColor={useColorModeValue("orange.200", "gray.600")}
      boxShadow="sm"
    >
      <Text
        fontSize={{ base: "xl", md: "2xl" }}
        fontWeight="extrabold"
        fontFamily="mono"
        mb={2}
        color={useColorModeValue("orange.600", "orange.300")}
      >
        {timeString}
      </Text>

      <Flex
        direction={{ base: "column", sm: "row" }}
        justify="center"
        align="center"
        gap={2}
      >
        <Text fontSize="sm">{dateString}</Text>|
        <Text fontSize="sm" fontWeight="medium">
          {hijriDate}
        </Text>
      </Flex>
    </Box>
  );
};

export default BangladeshClock;
