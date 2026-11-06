Phase 1 completion report

1. Architecture. A single Spring Boot 3.2 server (Java 21 target) with REST under /api/v1, STOMP-over-SockJS WebSocket at /api/ws, and an Angular 17 web client.
- The live game state is one JSON document per game in Redis. MySQL holds the permanent record (moves, rounds, results, wallets).
- Kafka is configured in three places but never used; the backend runs fine without it.
- WebSocket messages go through Spring's in-memory broker, and each game is protected by an in-process lock, so this only works as a single server.

2. Mobile. There is no native app (no Capacitor or Cordova). Phones get the same Angular web app, with responsive styling and a "rotate your phone" screen on most pages. A web manifest exists, but no service worker is registered, so it can't be installed as an app.

3. Game engine. The rules live in GameEngine.java (dealing, meld checks, declarations, scoring). Turns, timeouts, rounds and results live in GameService.java (1,828 lines). The frontend has its own copy of the meld rules in rummy-rules.ts, and that copy decides which card is left out when a player declares. Nothing tests that the two copies agree.

4. Scoring.
- First drop costs 20, middle drop 40, wrong show 80.
- Losers are scored on their best possible card grouping, following the pure-sequence rule, capped at 80.
- The prize is entry fee × human seats, and the winner takes all.
- There is an older, simpler scoring function that is still tested but no longer used by the game.

5. Timers. The server checks every second, broadcasts the time remaining, and the turn length is hard-coded to 30 seconds. The config value for the timeout (60 in the dev profile) is never read.
- First timeout passes the turn; if the player had already drawn, a random card is discarded for them.
- Second timeout in a row counts as a 40-point dro
- The next round starts when every human has closed the round summary, or after 40 seconds.

6. WinnerControl. A separate Node app (port 4300, outside the repo) talks to a backend control API using a shared key. It picks the
round winner on tables with exactly one human:
- Other players' valid declarations are turned into 80-point wrong shows.
- A targeted bot's hand is rebuilt using cards fro

It is switched on by default, because the default  it with a key that's written in the source. Openquestions about this are listed in the architecture doc.

7. Test coverage.
- Backend: 64 tests. The engine tests are strong; elf, WebSocket handling, matchmaking, AI orsecurity.
- Frontend unit tests: none.
- Playwright: 31 tests per viewport, mostly checking that pages render.
- Probe scripts: 24 ad-hoc scripts, not part of an

8. Build and test results.

┌──────────────────┬──────────────────────────────────────────────────────────────────────────────┐
│      Check       │                                                  Result                                                   │
├──────────────────┼──────────────────────────────────────────────────────────────────────────────┤
│ Backend tests    │ 57 pass, 7 errors. All 7 are in WalletServiceTest: Mockito can't run on JDK 25 (the only JDK installed),  │
│                  │ and on top of that the test d                                                │
├──────────────────┼───────────────────────────────────────────────────────────────────────────────────────────────────────────┤
│ Production build │ Passes, with 18 warnings                                                     │
├──────────────────┼───────────────────────────────────────────────────────────────────────────────────────────────────────────┤
│ Frontend unit    │ Can't run, because there are                                                 │
│ tests            │                                                                                                           │
├──────────────────┼──────────────────────────────────────────────────────────────────────────────┤
│ Playwright,      │ 25 pass, 6 fail                                                                                           │
│ desktop          │                                                                              │
├──────────────────┼───────────────────────────────────────────────────────────────────────────────────────────────────────────┤
│ Playwright,      │ 14 pass, 17 fail                                                             │
│ mobile           │                                                                                                           │
└──────────────────┴──────────────────────────────────────────────────────────────────────────────┘

Most Playwright failures are tests that no longer rowser pop-up for Quit, look for a "Play WithFriends" panel that was removed, and assume the login page is blocked in portrait). Others fail only because a previous test's
cleanup no longer quits its game. The failures tha
- On iPhone/Safari every page logs two "not found" errors, because there is no apple-touch-icon image.
- In one mobile run, tapping the deck didn't draw whether that's a real bug or a timing problem in the test.

9. Major risks (all 17 are listed in BASELINE_REPORT §7):
- Real-money balance can be created freely. The "sdits the real-money wallet and has no sandbox check, so any logged-in user can top up their own balance.
- The production build breaks WebSocket off this P80 for the WebSocket address because angular.jsonnever swaps in the production settings. Any other device, including a phone on your Wi-Fi, can't connect.
- WebSocket connections without a valid login are cribe to any game's channel.
- Game state can drift from the database. The game lock is released before the database save completes, so if the save fails, Redis
  and what players were shown won't match the data
- No reconnect handling. After a dropped connection the client doesn't reload the game state, and moves sent while disconnected are
  silently lost.
- Developer settings are the default. WinnerControl and the developer game tools are on unless someone changes the profile.

10. Unknowns.
- What WinnerControl is meant to be used for.
- Whether the mobile deck tap is a real bug.
- Whether the database has a unique constraint bac protection.
- How the app behaves on reconnect or with a bad login token over WebSocket; I didn't exercise those paths.

11. Files created.
- qa/architecture/EXISTING_ARCHITECTURE.md (includ
- qa/reports/BASELINE_REPORT.md
- qa/reports/EXISTING_TEST_INVENTORY.md

Outside the repo I also installed Playwright's Web tests need. Docker (MySQL and Redis), the backendon :8080 and the frontend on :4200 are still running.