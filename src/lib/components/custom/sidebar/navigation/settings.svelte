<script lang="ts" module>
	import BriefcaseIcon from '@lucide/svelte/icons/briefcase';
	import Settings2Icon from '@lucide/svelte/icons/settings-2';
	import ShieldIcon from '@lucide/svelte/icons/shield';
	import StarIcon from '@lucide/svelte/icons/star';
	import UsersIcon from '@lucide/svelte/icons/users';
</script>

<script lang="ts">
	import NavMain from './navigation.svelte';
	import * as m from '$lib/paraglide/messages.js';
	import type { NavGroup } from '$lib/types/sidebar';

	const nav = $derived<NavGroup[]>([
		{
			items: [
				{
					title: m.nav_set_general(),
					url: '#',
					icon: Settings2Icon,
					items: [
						{ title: m.nav_set_tags(), url: '/tag' },
						{ title: m.nav_set_currencies(), url: '/currency' },
						{ title: m.nav_set_companies(), url: '/company' },
						{ title: m.nav_set_seasons(), url: '/season' }
					]
				},
				{
					title: m.nav_set_biz_group(),
					url: '#',
					icon: BriefcaseIcon,
					items: [
						{ title: m.nav_set_biz_opp_states(), url: '/business-case-state' },
						{ title: m.nav_set_biz_opp_types(), url: '/business-case-type' },
						{ title: m.nav_set_biz_offer_states(), url: '/offer-state' },
						{ title: m.nav_set_biz_ad_states(), url: '/advertising-space-item-state' },
						{ title: m.nav_set_biz_settings(), url: '/business-settings' },
						{ title: m.nav_set_biz_email_assistant(), url: '/mail-assistant' },
						{ title: m.nav_set_biz_contact_types(), url: '/contact-person-types' }
					]
				},
				{
					title: m.nav_set_fans_settings(),
					url: '#',
					icon: StarIcon,
					items: [
						{ title: m.nav_set_fans_newsletter_form(), url: '/newsletter' },
						{ title: m.nav_set_fans_loyalty(), url: '/touchpoint' },
						{ title: m.nav_set_fans_custom_font(), url: '/custom-font' },
						{ title: m.nav_set_fans_custom_block(), url: '/custom-block' },
						{ title: m.nav_set_fans_sending_domains(), url: '/sending-domain' },
						{ title: m.nav_set_fans_domain_prefix(), url: '/sending-domain-prefix' },
						{ title: m.nav_set_fans_reply_email(), url: '/email-for-reply' },
						{ title: m.nav_set_fans_custom_visitor_field(), url: '/custom-attribute' },
						{ title: m.nav_set_fans_waitlist(), url: '/waiting-list' },
						{ title: m.nav_set_fans_gdpr_texts(), url: '/gdpr-texts' },
						{ title: m.nav_set_fans_send_frequency(), url: '/frequency-cap' }
					]
				},
				{
					title: m.nav_set_users_access(),
					url: '#',
					icon: UsersIcon,
					items: [
						{ title: m.nav_set_user_masks(), url: '/privilege' },
						{ title: m.nav_set_user_groups(), url: '/user-group' },
						{ title: m.nav_set_users(), url: '/user' }
					]
				},
				{
					title: m.nav_set_security_logs(),
					url: '#',
					icon: ShieldIcon,
					items: [
						{ title: m.nav_set_security(), url: '/settings/security' },
						{ title: m.nav_set_logs(), url: '/log' }
					]
				}
			]
		}
	]);
</script>

{#each nav as group, i (i)}
	<NavMain label={group.label} items={group.items} />
{/each}
