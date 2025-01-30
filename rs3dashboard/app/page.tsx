import Image from "next/image";
import { EventTable } from "./WildyEvents/EventTable";

export default function Home() {
  return (
    <div style={{ width: '300px', overflowX: 'auto' }}>
      <EventTable />
    </div>
  );
}