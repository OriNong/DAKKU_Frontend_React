const setUpEvent = (eventSourceRef) => {
  eventSourceRef.current = new EventSource(
    `${process.env.REACT_APP_HOST}/message/subscribe`
  );
  eventSourceRef.current.onopen = (e) => {
    console.log("on open");
    console.log(e);
  };

  eventSourceRef.current.onerror = (e) => {
    console.log("error");
    console.log(e);
    if (
      e.currentTarget instanceof EventSource &&
      e.currentTarget.readState === EventSource.CLOSED
    ) {
      console.log("연결 종료");
      eventSourceRef.current?.close();
    }
  };

  return () => {
    eventSourceRef.current?.close();
  };
};

export default setUpEvent;
