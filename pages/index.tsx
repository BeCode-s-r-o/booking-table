import {
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Stack,
  useToast,
} from "@chakra-ui/react";
import {
  getAuth,
  onAuthStateChanged,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function SimpleCard() {
  const [data, setData] = useState({ email: "", password: "" });
  const toast = useToast();
  const [user, setUser] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
        router.push("/booking");
      } else {
        setUser(null);
      }
    });

    return () => unsubscribe();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleInputChange = (event: any) => {
    setData({ ...data, [event.target.name]: event.target.value });
  };

  const handleSubmit = (event: any) => {
    event.preventDefault();
    signInWithEmailAndPassword(getAuth(), data.email, data.password)
      .then((userCredential) => {
        setUser(userCredential.user);
        router.push("/booking");
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        toast({
          title: "Chyba pri prihlásení",
          description: `${errorCode} - ${errorMessage}`,
          status: "error",
          duration: 9000,
          isClosable: true,
        });
      });
  };

  const handleKeyDown = (event: any) => {
    if (event.key === "Enter") {
      handleSubmit(event);
    }
  };

  if (user) {
    return null; // render nothing until redirection happens
  }

  return (
    <Flex minH={"100vh"} align={"center"} justify={"center"} bg="gray.50">
      <Stack spacing={8} mx={"auto"} maxW={"lg"} py={12} px={6}>
        <Stack align={"center"}>
          <Heading fontSize={"4xl"}>Prihlásenie - Granárium</Heading>
        </Stack>
        <Box rounded={"lg"} bg="white" boxShadow={"lg"} p={8}>
          <Stack spacing={4}>
            <FormControl id="email">
              <FormLabel>Email</FormLabel>
              <Input
                onChange={handleInputChange}
                type="email"
                name="email"
                onKeyDown={handleKeyDown}
              />
            </FormControl>
            <FormControl id="password">
              <FormLabel>Heslo</FormLabel>
              <Input
                onChange={handleInputChange}
                type="password"
                name="password"
                onKeyDown={handleKeyDown}
              />
            </FormControl>
            <Stack spacing={10}>
              <Button
                onClick={handleSubmit}
                bg={"blue.400"}
                color={"white"}
                _hover={{
                  bg: "blue.500",
                }}
              >
                Prihlásiť sa
              </Button>
            </Stack>
          </Stack>
        </Box>
      </Stack>
    </Flex>
  );
}
