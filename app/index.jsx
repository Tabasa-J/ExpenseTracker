// app/index.jsx
import { Redirect } from "expo-router";

export default function Index() {
  // Safe redirect – works on web + native
  return <Redirect href="/welcomepage" />;
}
