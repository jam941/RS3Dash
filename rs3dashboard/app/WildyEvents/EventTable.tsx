"use client";
import React, { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableRow,
} from "@/components/ui/table";
import { events } from "./Events";

export const EventTable = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [countdown, setCountdown] = useState("");

  useEffect(() => {
    const now = new Date();
    const delay = (60 - now.getMinutes()) * 60 * 1000 - now.getSeconds() * 1000 - now.getMilliseconds();
    const intervalId = setTimeout(() => {
      setCurrentTime(new Date());
      setInterval(() => {
        setCurrentTime(new Date());
      }, 60 * 60 * 1000);
    }, delay);

    return () => clearTimeout(intervalId);
  }, []);

  useEffect(() => {
    const updateCountdown = () => {
      const now = new Date();
      const nextHour = new Date(now.getTime());
      nextHour.setHours(now.getHours() + 1, 0, 0, 0);
      const remainingTime = nextHour.getTime() - now.getTime();
      const minutes = Math.floor((remainingTime / (1000 * 60)) % 60).toString().padStart(2, '0');
      const seconds = Math.floor((remainingTime / 1000) % 60).toString().padStart(2, '0');
      setCountdown(`${minutes}:${seconds}`);
    };

    updateCountdown();
    const countdownInterval = setInterval(updateCountdown, 1000);

    return () => clearInterval(countdownInterval);
  }, [currentTime]);

  const getNextEvent = (): string => {
    const startTime = new Date("2025-01-30T03:00:00Z");
    const elapsedTime = (currentTime.getTime() - startTime.getTime()) / (1000 * 60 * 60); // elapsed time in hours
    const currentIndex = Math.floor(elapsedTime) % events.length;
    return events[currentIndex].name;
  };

  const reorderEvents = (events: any[], index: number): any[] => {
    if (index < 0 || index >= events.length) {
      throw new Error("Index out of bounds");
    }
    return [...events.slice(index), ...events.slice(0, index)];
  };

  const getEventTime = (event: string, useUTC: boolean = false): string => {
    const startTime = new Date("2025-01-30T03:00:00Z");
    const elapsedTimeMinutes = (currentTime.getTime() - startTime.getTime()) / (1000 * 60); // elapsed time in minutes

    const refEvent = getNextEvent();
    const index = events.findIndex((e) => e.name === refEvent);

    const reorderedEvents = reorderEvents(events, index);
    const eventIndex = reorderedEvents.findIndex((e) => e.name === event);
    const eventTimeOffset = eventIndex + 1;

    // Calculate the event time and round down to the nearest hour
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
  };

  const nextEvent = getNextEvent();
  return (
    <div style={{ position: "relative" }}>
      <Table>
        <TableCaption>Upcoming Wilderness Events</TableCaption>
        <TableBody>
          {events.map((event) => (
            <TableRow
              key={event.id}
              className={event.name === nextEvent ? "bg-yellow-200" : ""}
            >
              <TableCell>
                <a
                    href={`https://runescape.wiki/w/Wilderness_Flash_Events#${event.name.replaceAll(" ","_")}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={event.isSpecial ? { textDecoration: 'underline', fontStyle: 'italic' } : {}}
                >
                    {event.name}
                </a>
                </TableCell>
              <TableCell>{getEventTime(event.name, false)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TableCell colSpan={2} className="text-center">Next Event: {nextEvent} in {countdown} Minutes</TableCell>
          </TableRow>
        </TableFooter>
      </Table>
    </div>
  );
};