import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import chatService from '../chatService.js';

describe('chatService - URL and header construction', () => {
  let mock;
  let chatService;

  beforeAll(async () => {
    // dynamically import ESM module
    const mod = await import('../chatService.js');
    chatService = mod.default;
  });

  beforeEach(() => {
    mock = new MockAdapter(axios);
  });

  afterEach(() => {
    mock.restore();
  });

  test('getConversations builds correct URL and headers', async () => {
    mock.onGet(/\/chat\/conversations$/).reply(200, []);

    await chatService.getConversations('tok123');

    const req = mock.history.get[0];
    expect(req).toBeDefined();
    expect(req.url.endsWith('/chat/conversations')).toBe(true);
    expect(req.headers.Authorization).toBe('Bearer tok123');
  });

  test('createOrGetConversation posts recipientId and sets header', async () => {
    mock.onPost(/\/chat\/conversations$/).reply(200, {});

    await chatService.createOrGetConversation('recipient-1', 't-1');

    const req = mock.history.post[0];
    expect(req).toBeDefined();
    expect(req.url.endsWith('/chat/conversations')).toBe(true);
    expect(req.headers.Authorization).toBe('Bearer t-1');
    expect(JSON.parse(req.data)).toEqual({ recipientId: 'recipient-1' });
  });

  test('getMessagesForConversation requests messages with correct URL and header', async () => {
    mock.onGet(/\/chat\/conversations\/[^/]+\/messages$/).reply(200, []);

    await chatService.getMessagesForConversation('conv-123', 'tok');

    const req = mock.history.get[0];
    expect(req.url.endsWith('/conversations/conv-123/messages')).toBe(true);
    expect(req.headers.Authorization).toBe('Bearer tok');
  });

  test('getTotalUnreadCount calls correct endpoint and header', async () => {
    mock.onGet(/\/chat\/messages\/unread\/total$/).reply(200, { count: 5 });

    await chatService.getTotalUnreadCount('abc');

    const req = mock.history.get[0];
    expect(req.url.endsWith('/messages/unread/total')).toBe(true);
    expect(req.headers.Authorization).toBe('Bearer abc');
  });

  test('getUnreadCountForConversation calls correct endpoint', async () => {
    mock.onGet(/\/chat\/conversations\/[^/]+\/messages\/unread$/).reply(200, { count: 2 });

    await chatService.getUnreadCountForConversation('conv-x', 'tokX');

    const req = mock.history.get[0];
    expect(req.url.endsWith('/conversations/conv-x/messages/unread')).toBe(true);
    expect(req.headers.Authorization).toBe('Bearer tokX');
  });

  test('markConversationAsRead sends PUT to correct endpoint', async () => {
    mock.onPut(/\/chat\/conversations\/[^/]+\/messages\/read$/).reply(200, {});

    await chatService.markConversationAsRead('c-1', 'tkn');

    const req = mock.history.put[0];
    expect(req.url.endsWith('/conversations/c-1/messages/read')).toBe(true);
    expect(req.headers.Authorization).toBe('Bearer tkn');
  });

  test('createMessage posts content to correct endpoint', async () => {
    mock.onPost(/\/chat\/conversations\/[^/]+\/messages$/).reply(201, {});

    await chatService.createMessage('conv-9', 'hello world', 'tok9');

    const req = mock.history.post[0];
    expect(req.url.endsWith('/conversations/conv-9/messages')).toBe(true);
    expect(req.headers.Authorization).toBe('Bearer tok9');
    expect(JSON.parse(req.data)).toEqual({ content: 'hello world' });
  });

  test('deleteMessage calls DELETE on correct URL', async () => {
    mock.onDelete(/\/chat\/messages\/[^/]+$/).reply(200, {});

    await chatService.deleteMessage('msg-777', 'del-token');

    const req = mock.history.delete[0];
    expect(req.url.endsWith('/messages/msg-777')).toBe(true);
    expect(req.headers.Authorization).toBe('Bearer del-token');
  });

  test('searchMessages includes query and pagination params', async () => {
    mock.onGet(/\/chat\/conversations\/[^/]+\/messages\/search/).reply(200, []);

    await chatService.searchMessages('conv-s', 'findme', 's-token', { page: 2, limit: 10 });

    const req = mock.history.get[0];
    expect(req.url.includes('/conversations/conv-s/messages/search')).toBe(true);
    // Query params are in the url string
    expect(req.url.includes('q=findme')).toBe(true);
    expect(req.url.includes('page=2')).toBe(true);
    expect(req.url.includes('limit=10')).toBe(true);
    expect(req.headers.Authorization).toBe('Bearer s-token');
  });
});
