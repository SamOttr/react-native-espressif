#import "React/RCTBridgeModule.h"
#import "React/RCTEventEmitter.h"
#import "React/RCTViewManager.h"

@interface RCT_EXTERN_MODULE(Espressif, RCTEventEmitter)
RCT_EXTERN_METHOD(setConfig:(NSDictionary*)config resolve:(RCTPromiseResolveBlock)resolve reject:(RCTPromiseRejectBlock)reject)
RCT_EXTERN_METHOD(scanDevices)
RCT_EXTERN_METHOD(writeData)
RCT_EXTERN_METHOD(setCredentials:(NSString*)ssid (NSString*)passphrase)
RCT_EXTERN_METHOD(connectTo:(NSString*)uuid)
@end
