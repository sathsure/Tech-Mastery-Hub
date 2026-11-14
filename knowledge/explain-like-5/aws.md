# AWS — Explain Like I'm 5

> Hard ideas as everyday pictures, then what they really mean.

## Cloud
🚕 Taking a taxi instead of buying a car — pay only for the ride.
**Really:** rent computing resources and pay for what you use.

## Region & Availability Zone
🏙️ A region is a city; AZs are separate buildings in that city with their own power, so one fire doesn't stop everything.
**Really:** geographic areas made of isolated data centres.

## EC2 vs Lambda
🏠 EC2 is renting a whole flat (you look after it). Lambda is a hotel room you use for minutes and leave.
**Really:** a server you manage vs a function that runs on demand.

## S3
🗄️ A giant, endless locker room where every locker has a web address.
**Really:** object storage reached over HTTP.

## VPC and subnets
🏘️ A gated colony (VPC): some houses face the main road (public subnets), others are inside with no road access (private subnets).
**Really:** your private network, split into public and private parts.

## Security Group
💂 A guard at each house's door with a list of allowed visitors.
**Really:** a firewall around each instance.

## IAM role
🪪 A visitor badge that opens certain doors and expires at the end of the day.
**Really:** temporary permissions for a service or user.

## Auto Scaling
🛒 A supermarket opening more tills when the queue gets long.
**Really:** adding and removing servers with demand.
