import Lru from "lru-cache";

let cache: Lru<string, any>;

declare global {
  var __cache: Lru<string, any> | undefined;
}

// We don't want to the cache to be purged on restart in development.
if (process.env.NODE_ENV === "production") {
  cache = new Lru({ max: 5000 });
} else {
  if (!global.__cache) {
    global.__cache = new Lru({ max: 5000 });
  }
  cache = global.__cache;
}

export { cache };
