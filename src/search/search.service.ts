import { Injectable } from '@nestjs/common';
import { CentralBloodService } from 'src/central_bloods/central_blood.service';
import { DonateBloodService } from 'src/donate_bloods/donate_bloods.service';
import { LocationService } from 'src/locations/location.service';
import { ReceiverBloodService } from 'src/receiver_bloods/receiver.service';
import { SearchByDistance } from 'src/shared/enums/searchByDistance.enum';
import { SearchUser } from 'src/shared/types/search-user';
import { getTypeLabel } from 'src/shared/utils/getTypeLabel';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class SearchService {
    constructor(
        private readonly locationService: LocationService,
        private readonly userService: UsersService,
        private readonly donateBloodService: DonateBloodService,
        private readonly receiveBloodService: ReceiverBloodService,
        private readonly centralService: CentralBloodService
    ) {
    }

    async searchDonorList(): Promise<SearchUser[]> {
        const donorIds = await this.donateBloodService.findListDonateActive();

        const result = donorIds.map(d => ({
            user_id: d.user_id,
            type: 'hien' as const,
        }));

        return result;
    }

    async searchRecipientList(): Promise<SearchUser[]> {
        const receiveList = await this.receiveBloodService.findListReceiveActive();

        const result = receiveList.map(r => ({
            user_id: r.user_id,
            type: 'can' as const,
            requestType: r.requestType,
        }));

        return result;
    }

    async searchCompleteRequest(): Promise<SearchUser[]> {
        const [listIdByDonate, listIdByReceive] = await Promise.all([
            this.donateBloodService.findListDonateComplete(),
            this.receiveBloodService.findListReceiveComplete(),
        ]);

        const result = [
            ...listIdByDonate.map(d => ({
                user_id: d.user_id,
                type: "lichsu" as const,
            })),
            ...listIdByReceive.map(r => ({
                user_id: r.user_id,
                type: "lichsu" as const,
            })),
        ];

        return result;
    }

    private async mapNearbyLocationsToSearchResult(nearbyList: Awaited<ReturnType<LocationService['findNearbyUsersWithDistance']>>) {
        const [donors, receivers, history, allUsers] = await Promise.all([
            this.searchDonorList(),
            this.searchRecipientList(),
            this.searchCompleteRequest(),
            this.userService.findAllNoFilter()
        ]);

        const targetList = [...donors, ...receivers, ...history];
        const targetMap = new Map(targetList.map(t => [t.user_id.toString(), t]));
        const userMap = new Map(allUsers.map(u => [u._id.toString(), u.fullname]));

        const resolvedResults = await Promise.all(
            nearbyList.map(async (loc) => {
                const user = await this.userService.getUserByLocationID(loc.location_id);
                if (!user) return null;

                const userId = user.user_id;
                const targetData = targetMap.get(userId);
                if (!targetData) return null;

                const fullname = userMap.get(userId) ?? "Người dùng";
                const label = targetData.requestType === 'EMERGENCY'
                    ? getTypeLabel('cangap')
                    : getTypeLabel(targetData.type);

                return {
                    id: loc.location_id,
                    distance: loc.distance,
                    type: targetData.type,
                    name: `${fullname} - ${label}`,
                };
            })
        );

        return resolvedResults.filter(Boolean);
    }

    async searchByCentralDistance(central_id: string, radiusInKm: number) {
        const central = await this.centralService.findOne(central_id);
        const [lng, lat] = central.position.coordinates;
        const nearbyList = await this.locationService.findNearbyUsersWithDistance(lat, lng, radiusInKm);
        return this.mapNearbyLocationsToSearchResult(nearbyList);
    }

    async searchByUserCurrentDestination(lat: number, lng: number, radiusInKm: number) {
        const nearbyList = await this.locationService.findNearbyUsersWithDistance(lat, lng, radiusInKm);
        return this.mapNearbyLocationsToSearchResult(nearbyList);
    }

    async searchByDistance(user_id: string, radiusInKm: number, typeToSearch: string) {
        if (!typeToSearch) {
            typeToSearch = 'ALL';
        }

        const getUser = await this.userService.findOneNoPopulate(user_id);
        const userLocation = await this.locationService.findById(getUser.location_id);
        const [lat, lng] = [
            userLocation.position.coordinates[1],
            userLocation.position.coordinates[0],
        ];

        // 1. Lấy tất cả các location gần user
        const nearbyList = await this.locationService.findNearbyUsersWithDistance(lat, lng, radiusInKm);

        // 2. Lấy danh sách target tương ứng với typeToSearch
        let targetList: SearchUser[] = [];

        if (typeToSearch === SearchByDistance.DONATE) {
            targetList = await this.searchDonorList();
        } else if (typeToSearch === SearchByDistance.RECEIVE) {
            targetList = await this.searchRecipientList();
        } else if (typeToSearch === SearchByDistance.HISTORY) {
            targetList = await this.searchCompleteRequest();
        } else {
            const [donors, receivers, history] = await Promise.all([
                this.searchDonorList(),
                this.searchRecipientList(),
                this.searchCompleteRequest()
            ]);
            targetList = [...donors, ...receivers, ...history];
        }

        // 3. Map user_id -> SearchUser để dễ tra
        const targetMap = new Map(targetList.map(u => [u.user_id.toString(), u]));

        // 4. Lấy toàn bộ user info để gán name
        const allUsers = await this.userService.findAllNoFilter();
        const userMap = new Map(allUsers.map(u => [u._id.toString(), u.fullname]));

        // 5. Lọc kết quả có user_id trùng với targetList
        const resolvedResults = await Promise.all(
            nearbyList.map(async (loc) => {
                const userInLocation = await this.userService.getUserByLocationID(loc.location_id);
                if (!userInLocation) return null;

                const userId = userInLocation.user_id;
                const targetData = targetMap.get(userId);
                if (!targetData) return null;

                const fullname = userMap.get(userId) ?? "Người dùng";
                const label = targetData.requestType === 'EMERGENCY'
                    ? getTypeLabel('cangap')
                    : getTypeLabel(targetData.type);

                return {
                    id: loc.location_id,
                    distance: loc.distance,
                    type: targetData.type,
                    name: `${fullname} - ${label}`,
                };
            })
        );

        // 6. Lọc null
        return resolvedResults.filter(Boolean);
    }




}