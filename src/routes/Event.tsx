import { useParams } from "react-router";

const Event = () => {
  const { eventId } = useParams();
  return <div>Event {eventId}</div>;
};

export default Event;
