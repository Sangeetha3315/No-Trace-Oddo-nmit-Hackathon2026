package com.dayflow.security;

import org.springframework.stereotype.Service;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.AtomicInteger;

@Service
public class RateLimiterService {

    private static final int MAX_ATTEMPTS = 5;
    private static final long LOCK_TIME_DURATION = 15 * 60 * 1000; // 15 minutes

    private final Map<String, AtomicInteger> attemptsMap = new ConcurrentHashMap<>();
    private final Map<String, Long> lockTimeMap = new ConcurrentHashMap<>();

    public boolean isBlocked(String key) {
        if (lockTimeMap.containsKey(key)) {
            long lockTime = lockTimeMap.get(key);
            if (System.currentTimeMillis() - lockTime > LOCK_TIME_DURATION) {
                lockTimeMap.remove(key);
                attemptsMap.remove(key);
                return false;
            }
            return true;
        }
        return false;
    }

    public void loginFailed(String key) {
        attemptsMap.putIfAbsent(key, new AtomicInteger(0));
        int attempts = attemptsMap.get(key).incrementAndGet();
        if (attempts >= MAX_ATTEMPTS) {
            lockTimeMap.put(key, System.currentTimeMillis());
        }
    }

    public void loginSucceeded(String key) {
        attemptsMap.remove(key);
        lockTimeMap.remove(key);
    }
}
