import {
  Box,
  Text,
  Heading,
  VStack,
  Spinner,
  useColorModeValue,
  Divider,
  HStack,
  Icon,
  useBreakpointValue,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import axios from "axios";
import { FaMosque, FaClock } from "react-icons/fa";

const prayerOrder = ["Fajr", "Sunrise", "Dhuhr", "Asr", "Maghrib", "Isha"];

const PrayerTimes = () => {
  const [times, setTimes] = useState(null);
  const [date, setDate] = useState(null);
  const [loading, setLoading] = useState(true);

  // Theme-aware values
  const bg = useColorModeValue("gray.100", "gray.600");
  const border = useColorModeValue("gray.200", "gray.400");
  const highlightBg = useColorModeValue("orange.100", "orange.300");
  const textSecondary = useColorModeValue("gray.600", "gray.300");
  const iconColor = useColorModeValue("orange.500", "orange.200");
  const timeColor = useColorModeValue("gray.700", "gray.200");

  // Responsive width
  const maxWidth = useBreakpointValue({
    base: "100%",
    md: "500px",
    lg: "600px",
  });

  useEffect(() => {
    const fetchTimes = async () => {
      try {
        const res = await axios.get(
          "https://api.aladhan.com/v1/timingsByCity?city=Sylhet&country=Bangladesh&method=2"
        );
        setTimes(res.data.data.timings);
        setDate(res.data.data.date);
      } catch (err) {
        console.error("Failed to fetch prayer times", err);
      } finally {
        setLoading(false);
      }
    };

    fetchTimes();
  }, []);

  if (loading) {
    return (
      <Box textAlign="center" py={8}>
        <Spinner size="xl" color="orange.400" />
      </Box>
    );
  }

  return (
    <Box
      bg={bg}
      p={{ base: 4, md: 6 }}
      rounded="lg"
      boxShadow="md"
      border="1px solid"
      borderColor={border}
      maxW={maxWidth}
      mx="auto"
      mt={4}
    >
      <Heading
        size="lg"
        textAlign="center"
        mb={2}
        color={useColorModeValue("orange.600", "orange.200")}
      >
        🕌 Prayer Times – Balaganj, Sylhet
      </Heading>

      {date && (
        <Text textAlign="center" color={textSecondary} mb={4}>
          {date.gregorian.date} | {date.hijri.date}
        </Text>
      )}

      <Divider mb={4} borderColor={border} />

      <VStack spacing={3}>
        {prayerOrder.map((name) => (
          <HStack
            key={name}
            justify="space-between"
            w="100%"
            px={3}
            py={2}
            bg={name === getNextPrayer(times) ? highlightBg : "transparent"}
            borderRadius="md"
            transition="background 0.2s"
          >
            <HStack>
              <Icon as={FaMosque} color={iconColor} />
              <Text fontWeight="medium">{name}</Text>
            </HStack>
            <HStack>
              <Icon as={FaClock} color={timeColor} />
              <Text fontFamily="mono" color={timeColor}>
                {times[name]}
              </Text>
            </HStack>
          </HStack>
        ))}
      </VStack>
    </Box>
  );
};

// Utility to find the next prayer based on current time
function getNextPrayer(times) {
  if (!times) return null;
  const now = new Date();
  const today = now.toISOString().split("T")[0];

  for (let name of prayerOrder) {
    const timeStr = `${today} ${times[name]}`;
    const prayerTime = new Date(timeStr);
    if (prayerTime > now) return name;
  }
  return null;
}

export default PrayerTimes;
