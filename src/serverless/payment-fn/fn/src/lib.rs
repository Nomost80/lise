#[macro_use]
extern crate log;
extern crate env_logger;

pub fn handle(req : String) -> String {
    env_logger::init();
    debug!("Order received: {}", req);
    req
}