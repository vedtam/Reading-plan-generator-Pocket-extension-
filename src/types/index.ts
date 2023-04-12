export interface PocketResponse {
  status: 1,
  complete: 1,
  list: {'3296106988': {
    item_id: '3296106988',
    resolved_id: '3296106988',
    given_url: 'https://growthreading.com/building-reading-plan/',
    given_title: 'Building a Personal Reading Plan',
    favorite: '0',
    status: '0',
    time_added: '1680708427',
    time_updated: '1680726752',
    time_read: '0',
    time_favorited: '0',
    sort_id: 0,
    resolved_title: 'Building a Personal Reading Plan',
    resolved_url: 'https://growthreading.com/building-reading-plan/',
    excerpt: 'For many things in life we develop plans. When we travel, we make sure we know where we’re going and where we’ll be staying. In your career you probably have plans as well – such as which positions you want to grow towards and what you want to achieve.',
    is_article: '1',
    is_index: '0',
    has_video: '0',
    has_image: '0',
    word_count: '1448',
    lang: 'en',
    time_to_read: 7,
    top_image_url: 'https://growthreading.com/wp-content/uploads/2019/02/Reading-Plan-900x500.jpg',
    tags: [Object],
    listen_duration_estimate: 561
  }},
  error: null,
  search_meta: { search_type: 'normal' },
  since: 1680927905
}

export interface Bookmark {
  id: number;
  item_id: string;
  resolved_title: string;
  resolved_url: string;
  excerpt: string;
  time_to_read: number;
  is_article: string;
  time_added: Date;
  top_image_url: string;
  created_at: Date;
};

export interface Schedule {
  id: number;
  bookmarkId: number;
  startDate: Date;
  endDate: Date;
};

export interface Subscription {
  id: number;
  endpoint: string;
  expirationTime: Date;
  keys: string;
};