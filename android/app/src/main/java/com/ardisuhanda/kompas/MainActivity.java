package com.ardisuhanda.kompas;

import android.content.SharedPreferences;
import android.content.pm.PackageInfo;
import android.graphics.Color;
import android.os.Bundle;
import android.view.View;
import android.webkit.CookieManager;
import android.webkit.WebStorage;
import android.webkit.WebView;

import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {
  @Override
  public void onCreate(Bundle savedInstanceState) {
    boolean shouldClearWebViewData = shouldClearWebViewDataForVersion();
    if (shouldClearWebViewData) {
      clearSharedWebViewData();
    }

    super.onCreate(savedInstanceState);

    if (shouldClearWebViewData) {
      clearCurrentWebViewCache();
      markWebViewDataClearedForVersion();
    }

    getWindow().setStatusBarColor(Color.parseColor("#edf1ff"));
    getWindow().setNavigationBarColor(Color.WHITE);
    getWindow().getDecorView().setSystemUiVisibility(
      View.SYSTEM_UI_FLAG_LIGHT_STATUS_BAR | View.SYSTEM_UI_FLAG_LIGHT_NAVIGATION_BAR
    );
  }

  private boolean shouldClearWebViewDataForVersion() {
    try {
      SharedPreferences preferences = getSharedPreferences("app_version", MODE_PRIVATE);
      return !currentVersionName().equals(preferences.getString("last_clean_version", ""));
    } catch (Exception ignored) {
      return false;
    }
  }

  private String currentVersionName() throws Exception {
    PackageInfo packageInfo = getPackageManager().getPackageInfo(getPackageName(), 0);
    return packageInfo.versionName;
  }

  private void clearSharedWebViewData() {
    WebStorage.getInstance().deleteAllData();
    CookieManager cookieManager = CookieManager.getInstance();
    cookieManager.removeAllCookies(null);
    cookieManager.flush();
  }

  private void clearCurrentWebViewCache() {
    WebView webView = bridge != null ? bridge.getWebView() : null;
    if (webView != null) {
      webView.clearCache(true);
      webView.clearHistory();
    }
  }

  private void markWebViewDataClearedForVersion() {
    try {
      getSharedPreferences("app_version", MODE_PRIVATE)
        .edit()
        .putString("last_clean_version", currentVersionName())
        .apply();
    } catch (Exception ignored) {
      // Cache cleanup is best-effort; the app should still open if version lookup fails.
    }
  }
}
