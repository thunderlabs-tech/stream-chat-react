import { useEffect, useRef } from 'react';
export type ContainerMeasures = {
  offsetHeight: number;
  scrollHeight: number;
};
export type UseMessageListScrollManagerParams<Me> = {
  atBottomToleranceThreshold: number;
  currentUserId: () => string;
  messageId: (message: Me) => string;
  messages: Me[];
  messageUserId: (message: Me) => string;
  onNewMessages: () => void;
  onScrollBy: (scrollBy: number) => void;
  onScrollToBottom: () => void;
  scrollContainerMeasures: () => ContainerMeasures;
};

export function useMessageListScrollManager<Me>(
  inputs: UseMessageListScrollManagerParams<Me>,
) {
  const measures = useRef<ContainerMeasures>({
    offsetHeight: 0,
    scrollHeight: 0,
  });
  const messages = useRef<Me[]>();
  const scrollTop = useRef(0);

  const {
    atBottomToleranceThreshold,
    currentUserId,
    messageId,
    messageUserId,
    onNewMessages,
    onScrollBy,
    onScrollToBottom,
    scrollContainerMeasures,
  } = inputs;

  useEffect(() => {
    onScrollToBottom();
  }, []);

  useEffect(() => {
    const prevMessages = messages.current;
    const prevMeasures = measures.current;
    const newMessages = inputs.messages;
    const lastNewMessage = newMessages[newMessages.length - 1];
    const newMeasures = scrollContainerMeasures();

    if (typeof prevMessages !== 'undefined') {
      if (prevMessages.length < newMessages.length) {
        // messages added to the top
        if (
          messageId(prevMessages[prevMessages.length - 1]) ===
          messageId(lastNewMessage)
        ) {
          const listHeightDelta =
            newMeasures.scrollHeight - prevMeasures.scrollHeight;

          onScrollBy(listHeightDelta);
        }
        // messages added to the bottom
        else {
          const lastMessageIsFromCurrentUser =
            messageUserId(lastNewMessage) === currentUserId();

          if (lastMessageIsFromCurrentUser) {
            onScrollToBottom();
          } else {
            const wasAtBottom =
              prevMeasures.scrollHeight -
                prevMeasures.offsetHeight -
                scrollTop.current <
              atBottomToleranceThreshold;

            if (wasAtBottom) {
              onScrollToBottom();
            } else {
              onNewMessages();
            }
          }
        }
      }
    }

    messages.current = newMessages;
    measures.current = newMeasures;
  }, [measures, messages, inputs.messages]);

  return (scrollTopValue: number) => {
    scrollTop.current = scrollTopValue;
  };
}
