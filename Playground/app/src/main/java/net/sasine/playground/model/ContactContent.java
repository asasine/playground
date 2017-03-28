package net.sasine.playground.model;

import net.sasine.playground.fragment.dummy.DummyContent;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Helper class for providing sample content for user interfaces created by
 * Android template wizards.
 * <p>
 */
public class ContactContent {

    public static final List<ContactItem> ITEMS = new ArrayList<ContactItem>();

    public static final Map<String, ContactItem> ITEM_MAP = new HashMap<String, ContactItem>();

    private static final int COUNT = 25;

    static {
        // Add some sample items.
        for (int i = 1; i <= COUNT; i++) {
            addItem(createDummyItem(i));
        }
    }

    public static void addItem(ContactItem item) {
        ITEMS.add(item);
        ITEM_MAP.put(item.id, item);
    }

    public static ContactItem createDummyItem(int position) {
        return new ContactItem(String.valueOf(position), "Item " + position, makeDetails(position));
    }

    private static String makeDetails(int position) {
        StringBuilder builder = new StringBuilder();
        builder.append("Details about Item: ").append(position);
        for (int i = 0; i < position; i++) {
            builder.append("\nMore details information here.");
        }
        return builder.toString();
    }

    public static class ContactItem {
        public final String id;
        public final String content;
        public final String details;

        public ContactItem(String id, String content, String details) {
            this.id = id;
            this.content = content;
            this.details = details;
        }

        @Override
        public String toString() {
            return content;
        }
    }
}
