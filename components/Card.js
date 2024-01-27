import { Box, Heading, Text } from '@chakra-ui/react';

const Card = ({ title, value, chart }) => {
  return (
    <Box borderWidth="1px" borderRadius="lg" p={5} shadow="sm">
      {title && <Heading size="md" mb={4}>{title}</Heading>}
      {value && <Text fontSize="xl">{value}</Text>}
      {chart}
    </Box>
  );
};

export default Card;
