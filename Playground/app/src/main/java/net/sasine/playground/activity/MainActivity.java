package net.sasine.playground.activity;

import android.app.Activity;
import android.os.Bundle;
import android.support.v7.widget.LinearLayoutManager;
import android.support.v7.widget.RecyclerView;
import android.util.Log;
import android.view.View;

import net.sasine.playground.R;
import net.sasine.playground.fragment.ItemFragment;
import net.sasine.playground.fragment.MyItemRecyclerViewAdapter;
import net.sasine.playground.fragment.dummy.DummyContent;

public class MainActivity extends Activity implements ItemFragment.OnListFragmentInteractionListener {

    private final String TAG = "MainActivity";

    private RecyclerView mRecyclerView;
    private RecyclerView.Adapter mAdapter;
    private RecyclerView.LayoutManager mLayoutManager;

    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        mRecyclerView = (RecyclerView) findViewById(R.id.list);

        mRecyclerView.setHasFixedSize(true);

        mLayoutManager = new LinearLayoutManager(this);
        mRecyclerView.setLayoutManager(mLayoutManager);

        mAdapter = new MyItemRecyclerViewAdapter(DummyContent.ITEMS, this);
        mRecyclerView.setAdapter(mAdapter);

    }

    @Override
    public void onListFragmentInteraction(DummyContent.DummyItem item) {
        Log.i(TAG, "onListFragmentInteraction callback: " + item);
    }

    // Called by activity_main.xml button:onClick
    public void addDummyItem(View view) {
        // add DummyItem to DummyContent
        int nextId = mAdapter.getItemCount() + 1;
        Log.i(TAG, "Creating DummyItem " + nextId);
        DummyContent.addItem(DummyContent.createDummyItem(nextId));
        mAdapter.notifyDataSetChanged();
    }
}
