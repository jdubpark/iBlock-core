
# SERVER SCRIPT 2 TO SUPPORT MARKETPLACE SC
# submitting order to UPS

# initialize web3 session
	
	# connect to the blockchain

# understand the locations and their addresses
	# probably use another backend db for this?
	# the smart contract only has a human-readable string for the location
	# no other info, thus the need for another backend db
	# we could actually also just hardcode this, because we can update this code

# listen for event WarehouseOrder (bigOrder)
	# bigOrder details:
		# uint256 tokens_paid;
		# address student_chain_address;
		# uint256[] itemOrderIds;
		# bool picking_up_in_person;
		# string shipping_address;
		# uint256 time_ordered;
		# Statuses current_status;

	# for every itemOrderId in itemOrderIds
		# pull Item using the id
		# using inventory across locations, determine location and add to that locations order tracking


	# for every location, interact with corresponding API and submit the order

	# update the marketplace smart contract with the orderSubmitted event
	# for context orderSubmitted(uint256 _big_order_id, uint256 [] [size_size] [] calldata _quantity_by_itemOrder_size_and_location)