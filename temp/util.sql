
DROP TABLE ADDRESSES;
DROP TABLE CONNECTIONS;
DROP TABLE LOCATIONS ;
DROP TABLE PACKETS ;
DROP TABLE PROTOCOLS ;
DROP TABLE TYPES;

DELETE FROM ADDRESSES;
DELETE FROM CONNECTIONS;
DELETE FROM LOCATIONS ;
DELETE FROM PACKETS ;
DELETE FROM PROTOCOLS ;
DELETE FROM TYPES;

SELECT 
	Time,
	TimePeriod,
	HitCount, 
	Protocols.Name,
	ToAddr.Addr
FROM Packets
INNER JOIN Protocols
	ON Packets.ProtocolId = Protocols.ProtocolId
INNER JOIN Connections
	ON Packets.ConnectionId = Connections.ConnectionId
INNER JOIN Addresses AS FromAddr
	ON Connections.FromAddr = FromAddr.AddrId
INNER JOIN Addresses AS ToAddr
	ON Connections.ToAddr = ToAddr.AddrId;