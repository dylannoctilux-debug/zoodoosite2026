"use client";
import { useEffect, useState, useRef } from "react";
import LoadingBar, { LoadingBarRef } from "react-top-loading-bar";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import timeGridPlugin from "@fullcalendar/timegrid";
import listPlugin from "@fullcalendar/list";
import { getBookings, updateBooking } from "@/actions/booking";
import type { Booking } from "../../../shared/booking";
import luxonPlugin from "@fullcalendar/luxon3";
import { useToast } from "@/components/atom/use-toast";
import { DatesSetArg } from "@fullcalendar/core/index.js";
import { useRouter } from "next/navigation";

const STATUS_COLOR_MAP = {
  ACCEPTED: "green",
  PENDING: "gray",
  CANCELLED: "red",
};

const viewEvent = (events: Booking[]) => {
  return events.map((e) => ({
    title: e.name,
    start: e.start_time,
    end: e.end_time,
    backgroundColor: STATUS_COLOR_MAP[e.status],
    borderColor: STATUS_COLOR_MAP[e.status],
    extendedProps: {
      id: e.id,
    },
  }));
};

export const Calendar = ({ canUpdate = false }: { canUpdate?: boolean }) => {
  const [dateInfo, setDateInfo] = useState<DatesSetArg>();
  const [events, setEvents] = useState<Booking[]>([]);
  const { toast } = useToast();
  const router = useRouter();

  const loadingBarRef = useRef<LoadingBarRef>(null);
  useEffect(() => {
    if (dateInfo) {
      if (loadingBarRef.current) {
        loadingBarRef.current.continuousStart();
      }

      getBookings({
        startRange: dateInfo.startStr,
        endRange: dateInfo.endStr,
      })
        .then((data) => {
          if (!data.ok) throw new Error(data.error);
          setEvents(data.data);
        })
        .catch((e) => {
          toast({
            title: "Chưa tải được booking",
            description: e.message,
            variant: "destructive",
          });
        })
        .finally(() => {
          if (loadingBarRef.current) {
            loadingBarRef.current.complete();
          }
        });
    }
  }, [dateInfo, toast]);

  return (
    <>
      <LoadingBar color="#39B33A" ref={loadingBarRef} />
      <FullCalendar
        plugins={[
          dayGridPlugin,
          timeGridPlugin,
          interactionPlugin,
          listPlugin,
          luxonPlugin,
        ]}
        timeZone="Asia/Ho_Chi_Minh"
        eventDurationEditable={false}
        buttonText={{
          today: "Hôm nay",
          month: "Tháng",
          week: "Tuần",
          day: "Ngày",
          list: "Danh sách",
        }}
        headerToolbar={{
          left: "prev,next today",
          center: "title",
          right: "dayGridMonth,timeGridWeek,timeGridDay,listWeek",
        }}
        initialView="dayGridMonth"
        editable={canUpdate}
        selectable={true}
        selectMirror={true}
        dayMaxEvents={true}
        events={viewEvent(events)}
        datesSet={(_dateInfo) => {
          setDateInfo(_dateInfo);
        }}
        eventClick={(info) => {
          router.push(`/admin/booking/${info.event._def.extendedProps.id}`);
        }}
        eventDrop={async (info) => {
          if (!info.event.start || !info.event.end) {
            info.revert();
            return;
          }
          try {
            const result = await updateBooking({
              id: info.event.extendedProps.id,
              data: { start_time: info.event.start, end_time: info.event.end },
            });
            if (!result.ok) throw new Error(result.error);
          } catch (e) {
            info.revert();
            toast({
              title: "Chưa đổi được giờ",
              description: (e as Error).message,
              variant: "destructive",
            });
          }
        }}
        nowIndicator
      />
    </>
  );
};
