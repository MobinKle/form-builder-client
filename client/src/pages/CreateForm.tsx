import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { DndContext, DragOverlay, useSensor, useSensors } from '@dnd-kit/core';
import { restrictToWindowEdges } from '@dnd-kit/modifiers';
import { sortableKeyboardCoordinates } from '@dnd-kit/sortable';

import { KeyboardSensor, PointerSensor } from '../lib/dndKitSensors';
import FormElements from '../components/create-form/FormElements';
import {
  FormElementButton,
  FormElementButtonProps,
} from '../components/create-form/DraggableButton';
import { useEffect, useState } from 'react';
import FormPlayground from '../components/create-form/FormPlayground';
import Input from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import {CheckCircle2Icon,EyeIcon,HammerIcon,LockIcon,SaveIcon,} from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '../components/ui/AlertDialog';
import { useFormPlaygroundStore } from '../stores/formPlaygroundStore';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import useAxiosPrivate from '../hooks/useAxiosPrivate';
import toast from 'react-hot-toast';
import DemoInfoCard from '../components/create-form/DemoInfoCard';
import type { FormType } from '../types';
import { Switch } from '../components/ui/Switch';
import FormPreview from '../components/create-form/FormPreview';
import { useTranslation } from 'react-i18next';

interface Props {
  formType?: 'add' | 'edit' | 'view';
  form?: FormType;
}

export default function CreateForm({ formType = 'add', form }: Props) {
  const { t, i18n } = useTranslation();
  const { pathname } = useLocation();
  const { id } = useParams();
  const navigate = useNavigate();
  const isDemo = pathname === '/demo';
  const queryClient = useQueryClient();
const isRtl = i18n.language === 'fa';
const direction = isRtl ? 'ltr' : 'rtl';
  const isViewMode = formType === 'view';
  const [isPreview, setIsPreview] = useState(isViewMode);


  const [formName, setFormName] = useState(form?.name ?? '');
  const [activeButton, setActiveButton] =
    useState<FormElementButtonProps | null>(null);
  const [isDropped, setIsDropped] = useState(false);

  type SaveAction = 'draft' | 'final';

   const DRAFT_STATUS_CODE = 3;
    const FINAL_STATUS_CODE = 1;

const [savedFormId, setSavedFormId] = useState<string | undefined>(id);


  const addFormElement = useFormPlaygroundStore(state => state.addFormElement);
  const removeAllFormElements = useFormPlaygroundStore(
    state => state.removeAllFormElements,
  );
  const formElements = useFormPlaygroundStore(state => state.formElements);

  useEffect(() => {
    return () => {
      if (formType === 'edit') removeAllFormElements();
    };
  }, [removeAllFormElements, formType]);

useEffect(() => {
  if (isViewMode) {
    setIsPreview(true);
  }
}, [isViewMode]);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

const axiosPrivate = useAxiosPrivate();

const {
  mutate,
  isPending,
  variables: pendingAction,
} = useMutation({
  mutationFn: async (action: SaveAction) => {
    let targetFormId = savedFormId;

    const draftPayload = {
      name: formName.trim(),
      elements: formElements,
      statusCode: DRAFT_STATUS_CODE,
    };

    if (targetFormId) {
      await axiosPrivate.patch(`/forms/${targetFormId}`, draftPayload);
    } else {
      const response = await axiosPrivate.post('/forms', draftPayload);

      targetFormId =
        response.data?.id ??
        response.data?.data?.id ??
        response.data?.form?.id;

      if (!targetFormId) {
        throw new Error('Form id was not returned by the server');
      }
    }

    if (action === 'final') {
      await axiosPrivate.patch(`/forms/${targetFormId}`, {
        statusCode: FINAL_STATUS_CODE,
      });
    }

    return {
      id: String(targetFormId),
      action,
    };
  },

  onSuccess: ({ id: savedId, action }) => {
    setSavedFormId(savedId);

    queryClient.invalidateQueries({
      queryKey: ['forms'],
    });

    if (action === 'draft') {
      toast.success(t('formBuilder.draftSavedSuccessfully'));
      return;
    }

    toast.success(t('formBuilder.finalizedSuccessfully'));

    setFormName('');
    removeAllFormElements();
    navigate('/my-forms');
  },

  onError: (_error, action) => {
    toast.error(
      action === 'final'
        ? t('formBuilder.finalizeError')
        : t('formBuilder.draftSaveError'),
    );
  },
});
const saveForm = (action: SaveAction) => {
  if (isViewMode || isDemo || isPending) return;

  if (!formName.trim()) {
    toast.error(t('formBuilder.titleRequired'));
    return;
  }

  if (formElements.length === 0) {
    toast.error(t('formBuilder.emptyForm'));
    return;
  }

  mutate(action);
};


  return (
    <DndContext
      sensors={sensors}
      onDragStart={e => {
        setActiveButton(e.active.data.current?.element);
        setIsDropped(false);
      }}
      onDragCancel={() => {
        setActiveButton(null);
        setIsDropped(false);
      }}
      onDragEnd={({ over, active }) => {
        setActiveButton(null);
        if (!over) return;
        addFormElement(
          active.data.current?.element.text as string,
          active.id as string,
        );
        setIsDropped(true);
      }}
    >
<div className={`flex gap-12 ${i18n.language === 'en' ? 'flex-row-reverse' : 'flex-row'}`}>
  <FormElements isUpdate={formType === 'edit'} />
        <form
          className="flex flex-grow flex-col"
onSubmit={event => {
  event.preventDefault();
  saveForm('draft');
}}


        >
<section className={`mb-3 flex items-center justify-between ${i18n.language === 'en' ? 'flex-row-reverse' : ''}`}>
<div dir={i18n.language === 'fa' ? 'rtl' : 'ltr'} className="flex items-center gap-3">
  <label className="whitespace-nowrap font-medium">
    {t('formBuilder.title')}
  </label>

  <Input
    required
    dir="auto"
    className="flex-1 text-start [unicode-bidi:plaintext]"
    value={formName}
    onChange={e => setFormName(e.target.value)}
    placeholder={t('formBuilder.enterTitle')}
  />
</div>





  <div className={`flex items-center gap-4 text-sm font-medium ${i18n.language === 'en' ? 'flex-row-reverse' : ''}`}>
    <div className={`flex items-center gap-2 transition-colors ${isPreview ? '' : 'text-primary'}`}>
      <HammerIcon className="h-5 w-5" />
      <span>{t('formBuilder.builder')}</span>
    </div>
  <Switch
  className="data-[state=unchecked]:bg-primary"
  checked={isPreview}
  disabled={isViewMode}
  onCheckedChange={value => {
    if (isViewMode) return;
    setIsPreview(value);
  }}
  />
    <div className={`flex items-center gap-2 transition-colors ${isPreview ? 'text-primary' : ''}`}>
      <EyeIcon className="h-5 w-5" />
      <span>{t('formBuilder.preview')}</span>
    </div>
  </div>
</section>

          {isPreview ? (
            <FormPreview />
          ) : (
            <FormPlayground
              isDropped={isDropped}
              resetIsDropped={() => setIsDropped(false)}
              isUpdate={formType === 'edit'}
            />
          )}
          
<section
  dir={direction}
  className="mt-5 flex items-center justify-start gap-5"
>
  {isDemo && <DemoInfoCard />}

  {form ? (
    <Button onClick={() => navigate('/my-forms')} variant="outline">
      {t('formBuilder.cancelEdit')}
    </Button>
  ) : null}
 <Button
  type="submit"
  variant="outline"
  disabled={isDemo || isViewMode || isPending}
  isLoading={isPending && pendingAction === 'draft'}
  className="gap-2"
>
  {(isDemo || isViewMode) ? (
    <LockIcon className="h-[18px] w-[18px]" />
  ) : (
    <SaveIcon className="h-[18px] w-[18px]" />
  )}

  <span>{t('formBuilder.saveDraft')}</span>
</Button>

<AlertDialog>
  <AlertDialogTrigger asChild>
    <Button
      type="button"
      disabled={isDemo || isViewMode || isPending}
      className="gap-2 bg-emerald-600 hover:bg-emerald-700"
    >
      {isPending && pendingAction === 'final' ? (
        <span className="h-[18px] w-[18px] animate-spin rounded-full border-2 border-white border-t-transparent" />
      ) : (
        <CheckCircle2Icon className="h-[18px] w-[18px]" />
      )}

      <span>{t('formBuilder.finalApprove')}</span>
    </Button>
  </AlertDialogTrigger>

  <AlertDialogContent dir={direction}>
    <AlertDialogHeader>
      <AlertDialogTitle>
        {t('formBuilder.finalApprove')}
      </AlertDialogTitle>

      <AlertDialogDescription>
        {t('formBuilder.finalApproveDescription')}
      </AlertDialogDescription>
    </AlertDialogHeader>

    <AlertDialogFooter
      className={`gap-3 ${
        isRtl ? 'sm:flex-row-reverse' : 'sm:flex-row'
      }`}
    >
      <AlertDialogAction
        disabled={isPending}
        onClick={() => saveForm('final')}
        className="bg-emerald-600 hover:bg-emerald-700"
      >
        {t('formBuilder.confirmFinalApprove')}
      </AlertDialogAction>

      <AlertDialogCancel disabled={isPending}>
        {t('common.cancel')}
      </AlertDialogCancel>
    </AlertDialogFooter>
  </AlertDialogContent>
</AlertDialog>

</section>


        </form>
      </div>
      <DragOverlay modifiers={[restrictToWindowEdges]}>
        {activeButton ? (
          <FormElementButton className="cursor-grabbing" {...activeButton} />
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}
