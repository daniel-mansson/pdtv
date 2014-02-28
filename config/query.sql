SELECT 
	Time,
	TimePeriod,
	HitCount, 
	Protocols.Name AS Protocol,
	Types.Name AS TypeName,
	FromAddr.Addr AS FromAddr,
	FromLoc.Country AS FromCountry,
	FromLoc.City AS FromCity,
	FromLoc.Latitude AS FromLatitude,
	FromLoc.Longitude AS FromLongitude,
	ToAddr.Addr AS ToAddr,
	ToLoc.Country AS ToCountry,
	ToLoc.City AS ToCity,
	ToLoc.Latitude AS ToLatitude,
	ToLoc.Longitude AS ToLongitude

FROM Packets

INNER JOIN Protocols
	ON Packets.ProtocolId = Protocols.ProtocolId

INNER JOIN Types
        ON Types.TypeId = Packets.TypeId

INNER JOIN Connections
	ON Packets.ConnectionId = Connections.ConnectionId

INNER JOIN Addresses AS FromAddr
	ON Connections.FromAddr = FromAddr.AddrId

INNER JOIN Locations AS FromLoc
        ON FromLoc.LocationId = FromAddr.LocationId

INNER JOIN Addresses AS ToAddr
	ON Connections.ToAddr = ToAddr.AddrId

INNER JOIN Locations AS ToLoc
       ON ToLoc.LocationId = ToAddr.AddrId

ORDER BY Time;