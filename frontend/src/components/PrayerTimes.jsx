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
import BangladeshClock from "../components/BangladeshClock";
import axios from "axios";
import { FaMosque, FaClock } from "react-icons/fa";

// Define prayer names in English and Bengali
const prayerData = [
  { english: "Fajr", bangla: "ফজর" },
  { english: "Sunrise", bangla: "সূর্যোদয় 🌅" },
  { english: "Dhuhr", bangla: "যোহর" },
  { english: "Asr", bangla: "আসর" },
  { english: "Maghrib", bangla: "মাগরিব" },
  { english: "Isha", bangla: "ইশা" },
];

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

  // Convert 24-hour time to 12-hour format with AM/PM
  const formatTime12Hour = (time24) => {
    if (!time24) return "";
    const [hours, minutes] = time24.split(":");
    const hour = parseInt(hours, 10);
    const period = hour >= 12 ? "PM" : "AM";
    const hour12 = hour % 12 || 12;
    return `${hour12}:${minutes} ${period}`;
  };

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
        🕌 নামাজের সময়সূচী – বালাগঞ্জ, সিলেট
      </Heading>

      {date && (
        <Text textAlign="center" color={textSecondary} mb={4}>
          <BangladeshClock />
        </Text>
      )}

      <Divider mb={4} borderColor={border} />

      <VStack spacing={3}>
        {prayerData.map((prayer) => (
          <HStack
            key={prayer.english}
            justify="space-between"
            w="100%"
            px={3}
            py={2}
            bg={
              prayer.english === getNextPrayer(times)
                ? highlightBg
                : "transparent"
            }
            borderRadius="md"
            transition="background 0.2s"
          >
            <HStack>
              <Icon as={FaMosque} color={iconColor} />
              <Text fontWeight="medium" fontFamily="sans-serif">
                {prayer.bangla}
              </Text>
            </HStack>
            <HStack>
              <Icon as={FaClock} color={timeColor} />
              <Text fontFamily="mono" color={timeColor}>
                {times && formatTime12Hour(times[prayer.english])}
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

  for (let prayer of prayerData) {
    const timeStr = `${today} ${times[prayer.english]}`;
    const prayerTime = new Date(timeStr);
    if (prayerTime > now) return prayer.english;
  }
  return null;
}

export default PrayerTimes;
