import { useState, useEffect } from "react";
import { Text, Box, useColorModeValue, Flex, Tooltip } from "@chakra-ui/react";

const BangladeshClock = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [hijriDate, setHijriDate] = useState("");
  const [banglaDate, setBanglaDate] = useState("");

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

      // Format Bengali date
      const bangla = convertToBanglaDate(now);
      setBanglaDate(bangla);
    };

    updateDateTime();
    const timer = setInterval(updateDateTime, 1000);

    return () => clearInterval(timer);
  }, []);

  // Convert Gregorian date to Bengali date
  const convertToBanglaDate = (date) => {
    const banglaMonths = [
      "বৈশাখ",
      "জ্যৈষ্ঠ",
      "আষাঢ়",
      "শ্রাবণ",
      "ভাদ্র",
      "আশ্বিন",
      "কার্তিক",
      "অগ্রহায়ণ",
      "পৌষ",
      "মাঘ",
      "ফাল্গুন",
      "চৈত্র",
    ];

    const banglaDays = [
      "রবিবার",
      "সোমবার",
      "মঙ্গলবার",
      "বুধবার",
      "বৃহস্পতিবার",
      "শুক্রবার",
      "শনিবার",
    ];

    // Simple conversion (approximate)
    const day = date.getDay();
    const banglaYear = date.getFullYear() - 593;
    let banglaMonth = date.getMonth();
    let banglaDay = date.getDate();

    // Adjust for Bengali calendar starting mid-April
    if (date.getMonth() < 3 || (date.getMonth() === 3 && date.getDate() < 14)) {
      banglaMonth = (date.getMonth() + 8) % 12;
    } else {
      banglaMonth = (date.getMonth() + 9) % 12;
    }

    return `${banglaDays[day]}, ${banglaDay} ${banglaMonths[banglaMonth]}, ${banglaYear}`;
  };

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

      <Flex direction="column" gap={1}>
        <Flex justify="center" align="center" gap={2} wrap="wrap">
          <Tooltip label="Gregorian Date">
            <Text fontSize="sm">{dateString}</Text>
          </Tooltip>
          <Text>|</Text>
          <Tooltip label="বাংলা তারিখ">
            <Text fontSize="sm" fontFamily="sans-serif">
              {banglaDate} বঙ্গাব্দ
            </Text>
          </Tooltip>
        </Flex>
        <Tooltip label="হিজরি তারিখ">
          <Text fontSize="sm" fontWeight="medium">
            {hijriDate}
          </Text>
        </Tooltip>
      </Flex>
    </Box>
  );
};

export default BangladeshClock;
