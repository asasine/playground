def party_time(guests, n):
	new_guests = []
	best_index = 0
	i = 0
	while len(new_guests) < n or len(new_guests) == len(guests):
		guest = guests[i]
		if guest[1] < guests[best_index] and guest[0] not in new_guests:
			best_index = i
		if i == len(guests):
			new_guests.append(guests[best_index][0])
		i += 1
	return tuple(new_guests)
