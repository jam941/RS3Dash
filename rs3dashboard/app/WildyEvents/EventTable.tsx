import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { events } from "./Events";
import { get } from "http";
export const EventTable = ()=>{
    
    const getNextEvent = (): string => {
        const startTime = new Date("2025-01-30T03:00:00Z");
        const currentTime = new Date();
        const elapsedTime = (currentTime.getTime() - startTime.getTime()) / (1000 * 60 * 60); // elapsed time in hours
        const currentIndex = Math.floor(elapsedTime) % events.length;
        return events[currentIndex].name;
    }
    const reorderEvents = (events: any[], index: number): any[] => {
        if (index < 0 || index >= events.length) {
            throw new Error("Index out of bounds");
        }
        return [...events.slice(index), ...events.slice(0, index)];
    };

    

    const getEventTime = (event: string, useUTC: boolean = false): string => {
        const startTime = new Date("2025-01-30T03:00:00Z");
        const currentTime = new Date();
        const elapsedTimeMinutes = (currentTime.getTime() - startTime.getTime()) / (1000 * 60); // elapsed time in minutes
    
        const refEvent = getNextEvent();
        const index = events.findIndex((e) => e.name === refEvent);
    
        const reorderedEvents = reorderEvents(events, index);
        const eventIndex = reorderedEvents.findIndex((e) => e.name === event);
        const eventTimeOffset = eventIndex + 1;
    
        // Calculate the event time
        const eventTime = new Date(currentTime.getTime() + eventTimeOffset * 60 * 60 * 1000); // add offset in hours
        eventTime.setMinutes(0, 0, 0); // round down to the nearest hour
        let hours, minutes;
        if (useUTC) {
            hours = eventTime.getUTCHours().toString().padStart(2, '0');
            minutes = eventTime.getUTCMinutes().toString().padStart(2, '0');
        } else {
            hours = eventTime.getHours().toString().padStart(2, '0');
            minutes = eventTime.getMinutes().toString().padStart(2, '0');
        }
    
        return `${hours}:${minutes}`;
    }

    return (
        <Table>
          <TableCaption>Upcoming Wilderness Events</TableCaption>
          <TableBody>
            {events.map((event) => (
              <TableRow key={event.id}>
                <TableCell>{event.name}</TableCell>
                <TableCell>{getEventTime(event.name,false)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
          <TableFooter>
            <TableRow>
              <TableCell className="text-center">Next Event: {getNextEvent()}</TableCell>
            </TableRow>
          </TableFooter>
        </Table>
      )
}