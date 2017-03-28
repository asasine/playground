package net.sasine.playground.activity;

import android.app.Activity;
import android.os.Bundle;
import android.support.v7.widget.LinearLayoutManager;
import android.support.v7.widget.RecyclerView;
import android.util.Log;
import android.view.View;
import android.widget.ListView;

import net.sasine.playground.R;
import net.sasine.playground.database.DbHelper;
import net.sasine.playground.fragment.ItemFragment;
import net.sasine.playground.fragment.MyItemRecyclerViewAdapter;
import net.sasine.playground.fragment.dummy.DummyContent;

import java.util.ArrayList;

public class MainActivity extends Activity {

    private final String TAG = "MainActivity";

    public final static String EXTRA_MESSAGE = "MESSAGE";
    private ListView obj;
    DbHelper mydb;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        mydb = new DbHelper(this);
        ArrayList arrayList = mydb.getAllContacts();
    }
}
