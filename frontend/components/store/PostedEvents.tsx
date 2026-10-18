'use client';

import { createContext, useContext, type ReactNode } from 'react';
import type { PostedEvent } from '@/lib/slack/eventPost';

// Slack に投稿されたイベント。ページ（サーバー側）で読み込んで、ここから各部品に配る
const PostedEventsContext = createContext<PostedEvent[]>([]);

export function PostedEventsProvider({ events, children }: { events: PostedEvent[]; children: ReactNode }) {
  return <PostedEventsContext.Provider value={events}>{children}</PostedEventsContext.Provider>;
}

export const usePostedEvents = () => useContext(PostedEventsContext);
