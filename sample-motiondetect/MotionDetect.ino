#include "HttpClient.h"

int ledPin = D7;
int inputPin = D2;

int pirState = LOW;

int val = 0;

HttpClient http;
// Headers currently need to be set at init, useful for API keys etc.
http_header_t headers[] = {
    //  { "Content-Type", "application/json" },
    //  { "Accept" , "application/json" },
    { "Accept" , "*/*"},
    { NULL, NULL } // NOTE: Always terminate headers will NULL
};

http_request_t request;
http_response_t response;

void setup() {
  pinMode(ledPin, OUTPUT);
  pinMode(inputPin, INPUT);

  Serial.begin(9600);
}

void loop() {

  // put your main code here, to run repeatedly:
  val = digitalRead(inputPin);  // 入力値を読み取る。

  if (val == HIGH) {            // 入力が「HIGH」であるかどうか確認する。
    //digitalWrite(ledPin, HIGH);
    delay(300);

    if (pirState == LOW) {
      // たった今電源を入れたところです。
      Serial.println("Motion detected!");
      Spark.publish("MotionStatus","detected",60,PRIVATE);

      request.hostname = "www.goodmix.net";
          request.port = 80;
          request.path = "/photon/motiondetect/changestate.php?state=detect";
      http.get(request, response, headers);

      // 出力の変更は印刷するだけでいいのです。
      pirState = HIGH;
    }
  } else {
    //digitalWrite(ledPin, LOW);
    delay(300);

    if (pirState == HIGH){
      // たった今電源を切ったところです。
      Serial.println("Motion ended!");
      Spark.publish("MotionStatus","ended",60,PRIVATE);

      request.hostname = "www.goodmix.net";
          request.port = 80;
          request.path = "/photon/motiondetect/changestate.php?state=ended";
      http.get(request, response, headers);

      // 出力の変更は印刷するだけでいいのです。
      pirState = LOW;
    }
  }

  //Serial.print(val);
  //Serial.println("");

  delay(1000);
}
