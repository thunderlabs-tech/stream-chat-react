/* eslint-disable sort-keys */
import React, { useRef, useState } from 'react';
import * as ReactDOM from 'react-dom';
import { useMessageListScrollManager } from '../../src/components/MessageList/hooks/useMessageListScrollManager';

function uuidv4() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0,
      v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

const generateMessages = (length: number) =>
  Array.from({ length }, () => ({ id: uuidv4(), userId: '0' }));

const PREPEND_COUNT = 20;
function App() {
  const [messages, setMessages] = useState(() => generateMessages(25));
  const ref = useRef<HTMLDivElement>();
  const indexOffset = useRef(0);
  const isLoading = useRef(false);
  const updateScrollTop = useMessageListScrollManager<typeof messages[number]>({
    messages,
    messageId: (message) => message.id,
    onScrollBy: (scrollBy) => {
      console.log('Scrolling by', scrollBy);
      return ref.current.scrollBy({ top: scrollBy });
    },
    currentUserId: () => '2',
    messageUserId: (message) => message.userId,
    onNewMessages: () => console.log('new messages!'),
    onScrollToBottom: () => {
      console.log('Scrolling to bottom');
      return ref.current?.scrollTo({
        top: ref.current.scrollHeight,
        behavior: 'smooth',
      });
    },
    scrollContainerMeasures: () => ({
      offsetHeight: ref.current.offsetHeight,
      scrollHeight: ref.current.scrollHeight,
    }),
    atBottomToleranceThreshold: 100,
  });

  return (
    <div>
      <div
        onScroll={(e: React.UIEvent<HTMLDivElement>) => {
          const scrollTop = (e.target as HTMLDivElement).scrollTop;
          console.log({ scrollTop });
          updateScrollTop(scrollTop);
          if (scrollTop < 50 && !isLoading.current) {
            isLoading.current = true;
            setTimeout(() => {
              setMessages((messages) => {
                indexOffset.current -= PREPEND_COUNT;
                isLoading.current = false;
                return generateMessages(PREPEND_COUNT).concat(messages);
              });
            }, 100);
          }
        }}
        ref={ref}
        style={{
          height: 200,
          overflowY: 'auto',
          width: 300,
        }}
      >
        {messages.map((message, index) => (
          <div
            key={message.id}
            style={{ background: message.userId === '2' ? 'blue' : 'white' }}
          >
            Item #{index + indexOffset.current + 1000}
          </div>
        ))}
      </div>
      <button
        onClick={() => {
          setMessages(messages.concat([{ id: uuidv4(), userId: '0' }]));
        }}
      >
        new message
      </button>
      {' | '}
      <button
        onClick={() => {
          setMessages(messages.concat([{ id: uuidv4(), userId: '2' }]));
        }}
      >
        new own message
      </button>
    </div>
  );
}

ReactDOM.render(<App />, document.getElementById('root'));
